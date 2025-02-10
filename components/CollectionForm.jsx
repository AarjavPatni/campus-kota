import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/supabaseClient";
import { StudentList } from "./StudentList";
import { BillingList } from "./BillingList";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

const validationSchema = Yup.object({
  room_name: Yup.string().required("Room Name is required"),
  invoice_key: Yup.string().required("Invoice Key is required"),
  security_deposit: Yup.number().required("Security Deposit is required"),
  monthly_charge: Yup.number().required("Monthly Charge is required"),
  year: Yup.number().required(),
  month: Yup.number().required(),
  payment_date: Yup.date().required("Payment Date is required"),
  payment_method: Yup.string().required("Payment Method is required"),
  approved: Yup.boolean(),
  receipt_no: Yup.string().required("Receipt No is required"),
});

const CollectionForm = ({
  uid,
  returnToBill = true,
  invoice_key = undefined,
}) => {
  const [collectionDetails, setCollectionDetails] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [toggleForm, setToggleForm] = useState(true);
  const [nextInvoiceKey, setNextInvoiceKey] = useState(null);
  const [toggleToast, setToggleToast] = useState(false);
  const [toastOpacity, setToastOpacity] = useState(1);
  const [toastMessage, setToastMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchPastCollections = async () => {
      let collection_data;
      let collection_error;
      if (invoice_key === undefined) {
        collection_data = await supabase
          .from("collection")
          .select("*")
          .eq("uid", uid);
      } else {
        collection_data = await supabase
          .from("collection")
          .select("*")
          .eq("invoice_key", invoice_key);
      }
      collection_data = collection_data.data;

      let { data: student_details, error: student_error } = await supabase
        .from("student_details")
        .select("uid,room_name,security_deposit,monthly_rent,email,laundry_charge,other_charge")
        .eq("uid", uid);

      if (student_error) {
        console.error("Error fetching student details:", student_error);
      } else {
        setStudentDetails(student_details[0]);
      }

      if (collection_error) {
        console.error("Error fetching collection data:", collection_error);
      } else {
        if (invoice_key === undefined) {
          if (collection_data.length > 0) {
            collection_data.sort((a, b) => {
              const invoiceKeyA = a.invoice_key.replace(/-/g, "");
              const invoiceKeyB = b.invoice_key.replace(/-/g, "");
              return parseInt(invoiceKeyB) - parseInt(invoiceKeyA);
            });
            const nextInvoiceIndex =
              parseInt(collection_data[0].invoice_key.split("-").pop()) + 1;
            setNextInvoiceKey(
              `${new Date().getUTCFullYear()}-${uid}-${nextInvoiceIndex}`
            );
          } else {
            setNextInvoiceKey(`${new Date().getUTCFullYear()}-${uid}-1`);
          }
        }
        setCollectionDetails(collection_data[0] || null);
      }
    };

    fetchPastCollections();
  }, [uid]);

  const formik = useFormik({
    initialValues: {
      receipt_no: collectionDetails?.receipt_no ?? `${invoice_key || nextInvoiceKey || ""} (${studentDetails?.room_name || ""})`,
      invoice_key: invoice_key || nextInvoiceKey || "",
      room_name: collectionDetails?.room_name ?? studentDetails?.room_name ?? "",
      monthly_charge: collectionDetails?.monthly_charge ?? (studentDetails ? 
        (studentDetails.monthly_rent || 0) + 
        (studentDetails.laundry_charge || 0) + 
        (studentDetails.other_charge || 0) : 0),
      security_deposit: collectionDetails?.security_deposit ?? 0,
      year: collectionDetails?.year ?? new Date().getUTCFullYear(),
      month: collectionDetails?.month ?? new Date().getUTCMonth() + 1,
      payment_date: collectionDetails?.payment_date ?? new Date()
        .toISOString()
        .replace("Z", "+5:30")
        .split("T")[0],
      payment_method: collectionDetails?.payment_method ?? "Cash",
      approved: collectionDetails?.approved ?? false,
    },
    validationSchema,
    onSubmit: async (values) => {
      // Remove generated column from submission
      const { total_amount, ...submissionValues } = values;
      
      let resp, status;
      
      try {
        if (!invoice_key) {
          const response = await supabase
            .from("collection")
            .insert([submissionValues])
            .select();
          resp = response;
          status = resp.status;
        } else {
          const response = await supabase
            .from("collection")
            .update(submissionValues)
            .eq("invoice_key", invoice_key)
            .select();
          resp = response;
          status = resp.status;
        }

        if (resp.error) {
          setToastMessage({
            text: `Database Error: ${resp.error.message}`,
            type: "error"
          });
          throw resp.error;
        }

        if (status === 201 || status === 200) {
          // Send payment receipt email
          await fetch("/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: studentDetails.email,
              subject: `Payment Receipt - ${values.invoice_key}`,
              paymentDetails: {
                ...values,
                receipt_no: formik.values.receipt_no,
              },
              student: studentDetails
            }),
          });

          setToastMessage({
            text: "Payment recorded and receipt sent successfully",
            type: "success"
          });

          setTimeout(() => {
            setToastOpacity(0);
            setTimeout(() => {
              setToggleToast(false);
              window.location.href = "/admin";
            }, 300);
          }, 1500);

          setTimeout(() => {
            setToggleForm(false);
          }, 2000);
        } else {
          setToastMessage({
            text: `Unexpected status code: ${status}`,
            type: "error"
          });
        }

        setToggleToast(true);
        setToastOpacity(1);
        formik.resetForm();
      } catch (error) {
        console.log(values)
        setToastMessage({
          text: `Error: ${error.message}`,
          type: "error"
        });
        setToggleToast(true);
        setToastOpacity(1);
        console.error("Error:", error);
      }
    },
  });

  useEffect(() => {
    if (collectionDetails || studentDetails) {
      const { security_deposit, ...restCollection } = collectionDetails || {};
      const { 
        security_deposit: studentSecurity, 
        email,
        laundry_charge,   // Destructure to exclude
        other_charge,     // Destructure to exclude
        monthly_rent,     // Destructure to exclude
        ...restStudent 
      } = studentDetails || {};

      formik.setValues({
        ...formik.values,
        ...restCollection,
        ...restStudent,
        monthly_charge: collectionDetails?.monthly_charge ?? (studentDetails ? 
          (studentDetails.monthly_rent || 0) + 
          (studentDetails.laundry_charge || 0) + 
          (studentDetails.other_charge || 0) : 0),
        invoice_key: invoice_key || nextInvoiceKey,
        receipt_no: `${invoice_key || nextInvoiceKey || ""} (${studentDetails?.room_name || ""})`,
      });
    }
  }, [collectionDetails, studentDetails, invoice_key, nextInvoiceKey]);

  useEffect(() => {
    formik.setFieldValue(
      "total_amount",
      formik.values.monthly_charge + formik.values.security_deposit
    );
  }, [formik.values.monthly_charge, formik.values.security_deposit]);

  return (
    <div>
      {toggleForm ? (
        <div className="bg-black text-white p-8 rounded-lg max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Student Collection</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Receipt No */}
            <div>
              <label
                htmlFor="receipt_no"
                className="block text-sm font-medium mb-1"
              >
                Receipt No:
              </label>
              <input
                type="text"
                id="receipt_no"
                name="receipt_no"
                value={formik.values.receipt_no}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-700 text-gray-400 rounded"
                readOnly
                tabIndex={-1}
              />
              {formik.touched.receipt_no && formik.errors.receipt_no && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.receipt_no}
                </div>
              )}
            </div>

            {/* Payment Date */}
            <div>
              <label
                htmlFor="payment_date"
                className="block text-sm font-medium mb-1"
              >
                Payment Date:
              </label>
              <input
                type="date"
                id="payment_date"
                name="payment_date"
                value={formik.values.payment_date}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  formik.setFieldValue("payment_date", e.target.value);
                  formik.setFieldValue("month", date.getUTCMonth() + 1);
                  formik.setFieldValue("year", date.getUTCFullYear());
                }}
                onBlur={formik.handleBlur}
                className={`w-full p-2 rounded ${
                  formik.values.approved ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white'
                }`}
                readOnly={formik.values.approved}
                tabIndex={formik.values.approved ? -1 : 0}
              />
              {formik.touched.payment_date && formik.errors.payment_date && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.payment_date}
                </div>
              )}
            </div>

            {/* Monthly Charge */}
            <div>
              <label
                htmlFor="monthly_charge"
                className="block text-sm font-medium mb-1"
              >
                Monthly Charge:
              </label>
              <input
                type="number"
                id="monthly_charge"
                name="monthly_charge"
                value={formik.values.monthly_charge}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  formik.setFieldValue("monthly_charge", value);
                }}
                onBlur={formik.handleBlur}
                className={`w-full p-2 rounded ${
                  !!invoice_key ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white'
                }`}
                readOnly={!!invoice_key}
                tabIndex={!!invoice_key ? -1 : 0}
              />
              {formik.touched.monthly_charge && formik.errors.monthly_charge && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.monthly_charge}
                </div>
              )}
            </div>

            {/* Security Deposit */}
            <div>
              <label
                htmlFor="security_deposit"
                className="block text-sm font-medium mb-1"
              >
                Security Deposit:
              </label>
              <input
                type="number"
                id="security_deposit"
                name="security_deposit"
                value={formik.values.security_deposit}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  formik.setFieldValue("security_deposit", value);
                }}
                onBlur={formik.handleBlur}
                className={`w-full p-2 rounded ${
                  !!invoice_key ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white'
                }`}
                readOnly={!!invoice_key}
                tabIndex={!!invoice_key ? -1 : 0}
              />
              {formik.touched.security_deposit &&
                formik.errors.security_deposit && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.security_deposit}
                  </div>
                )}
            </div>

            <div>
              <label
                htmlFor="total_amount"
                className="block text-sm font-medium mb-1"
              >
                Total Amount:
              </label>
              <input
                type="number"
                id="total_amount"
                name="total_amount"
                value={formik.values.total_amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-700 text-gray-400 rounded"
                readOnly
                tabIndex={-1}
              />
              {formik.touched.total_amount && formik.errors.total_amount && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.total_amount}
                </div>
              )}
            </div>

            {/* Approved - Visible when editing */}
            <div className={invoice_key ? "" : "hidden"}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="approved"
                  name="approved"
                  checked={formik.values.approved}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mr-2 ${
                    formik.values.approved ? 'opacity-50' : 'opacity-100'
                  }`}
                  disabled={formik.values.approved}
                  tabIndex={formik.values.approved ? -1 : 0}
                />
                <label htmlFor="approved" className="text-sm font-medium">
                  Approved
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label
                htmlFor="payment_method"
                className="block text-sm font-medium mb-1"
              >
                Payment Method:
              </label>
              <select
                id="payment_method"
                name="payment_method"
                value={formik.values.payment_method}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 rounded ${
                  formik.values.approved ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white'
                }`}
                disabled={formik.values.approved}
                tabIndex={formik.values.approved ? -1 : 0}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
              </select>
              {formik.touched.payment_method &&
                formik.errors.payment_method && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.payment_method}
                  </div>
                )}
            </div>

            {/* Buttons */}
            {invoice_key === undefined ? (
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <button
                  type="submit"
                  className="w-full bg-white text-black p-2 rounded hover:bg-gray-200 transition"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-400 text-black p-2 rounded hover:bg-gray-200 transition"
                  onClick={() => setToggleForm(false)}
                >
                  Return to List
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <button
                  type="submit"
                  className="w-full bg-white text-black p-2 rounded hover:bg-gray-200 transition"
                >
                  Update
                </button>
              </div>
            )}
          </form>
        </div>
      ) : returnToBill ? (
        <BillingList />
      ) : (
        <StudentList />
      )}
      {toggleToast && (
        <div
          className="fixed bottom-28 right-4 z-50 transition-opacity duration-300 ease-in-out"
          style={{ opacity: toastOpacity }}
        >
          <Toast className="flex items-center bg-white shadow-lg rounded-lg p-4">
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              toastMessage.type === "success" 
                ? "bg-green-100 text-green-500" 
                : "bg-red-100 text-red-500"
            }`}>
              {toastMessage.type === "success" ? (
                <HiCheck className="h-5 w-5" />
              ) : (
                <HiX className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3 text-sm font-normal">{toastMessage.text}</div>
            <Toast.Toggle onDismiss={() => setToggleToast(false)} />
          </Toast>
        </div>
      )}
    </div>
  );
};

export default CollectionForm;
