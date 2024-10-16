import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/supabaseClient";
import { StudentList } from "./StudentList";
import { BillingList } from "./BillingList";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";

const validationSchema = Yup.object({
  room_name: Yup.string().required("Room Name is required"),
  invoice_key: Yup.string().required("Invoice Key is required"),
  security_deposit: Yup.number().required("Security Deposit is required"),
  monthly_rent: Yup.number().required("Monthly Rent is required"),
  electricity_charge: Yup.number().integer().default(0),
  laundry_charge: Yup.number().integer().default(0),
  other_charge: Yup.number().integer().default(0),
  total_charges: Yup.number()
    .integer()
    .positive("Total charges must be greater than 0"),
  total_amount: Yup.number()
    .integer()
    .positive("Total amount must be greater than 0"),
  year: Yup.number().required(),
  month: Yup.number().required(),
  payment_date: Yup.date().required("Payment Date is required"),
  payment_method: Yup.string().required("Payment Method is required"),
  approved: Yup.boolean(),
});

const CollectionForm = ({ uid, returnToBill = true }) => {
  const [collectionDetails, setCollectionDetails] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [toggleForm, setToggleForm] = useState(true);
  const [nextInvoiceKey, setNextInvoiceKey] = useState(null);
  const [toggleToast, setToggleToast] = useState(false);
  const [toastOpacity, setToastOpacity] = useState(0);

  useEffect(() => {
    const fetchPastCollections = async () => {
      let { data: collection_data, error: collection_error } = await supabase
        .from("collection")
        .select("invoice_key")
        .eq("uid", uid);

      let { data: student_details, error: student_error } = await supabase
        .from("student_details")
        .select("uid,room_name,security_deposit,monthly_rent")
        .eq("uid", uid);

      if (student_error) {
        console.error("Error fetching student details:", student_error);
      } else {
        setStudentDetails(student_details[0]);
      }

      if (collection_error) {
        console.error("Error fetching collection data:", collection_error);
      } else {
        if (collection_data.length > 0) {
          setCollectionDetails(collection_data[0]);
          // sort by invoice_key
          collection_data.sort((a, b) => {
            const invoiceKeyA = a.invoice_key.replace(/-/g, "");
            const invoiceKeyB = b.invoice_key.replace(/-/g, "");
            return parseInt(invoiceKeyB) - parseInt(invoiceKeyA);
          });
          const nextInvoiceIndex =
            parseInt(collection_data[0].invoice_key.split("-").pop()) + 1;
          console.log(collection_data[0]);
          setNextInvoiceKey(
            `${new Date().getUTCFullYear()}-${uid}-${nextInvoiceIndex}`
          );
        } else {
          setCollectionDetails(null);
          setNextInvoiceKey(`${new Date().getUTCFullYear()}-${uid}-1`);
        }
      }
    };

    fetchPastCollections();
  }, [uid]);

  const formik = useFormik({
    initialValues: {
      invoice_key: nextInvoiceKey || "",
      room_name: studentDetails?.room_name || "",
      security_deposit: 0,
      monthly_rent: 0,
      electricity_charge: 0,
      laundry_charge: 0,
      other_charge: 0,
      total_charges: 0,
      total_amount: 0,
      year: new Date().getUTCFullYear(),
      month: new Date().getUTCMonth() + 1,
      payment_date: new Date()
        .toISOString()
        .replace("Z", "+5:30")
        .split("T")[0],
      payment_method: "Cash",
      approved: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      delete values.total_amount
      delete values.total_charges
      const response = await supabase
        .from("collection")
        .insert([values])
        .select();

      const showToast = () => {
        setToggleToast(true);
        setTimeout(() => setToastOpacity(1), 10);

        setTimeout(() => {
          setToastOpacity(0);
          setTimeout(() => setToggleToast(false), 300);
          window.location.href = "/";
        }, 2000);
      };

      if (response.error) {
        console.error("Error inserting/updating data:", response.error);
      } else {
        formik.resetForm();
        showToast();
      }
    },
  });

  useEffect(() => {
    if (collectionDetails || studentDetails) {
      formik.setValues({
        ...formik.values,
        ...collectionDetails,
        ...studentDetails,
        invoice_key: nextInvoiceKey,
      });
    }
  }, [collectionDetails, studentDetails, nextInvoiceKey]);

  return (
    <div>
      {toggleForm ? (
        <div className="bg-black text-white p-8 rounded-lg max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Collection Form</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Invoice Key */}
            <div>
              <label
                htmlFor="invoice_key"
                className="block text-sm font-medium mb-1"
              >
                Invoice Key:
              </label>
              <input
                type="text"
                id="invoice_key"
                name="invoice_key"
                value={formik.values.invoice_key}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
                readOnly
              />
              {formik.touched.invoice_key && formik.errors.invoice_key && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.invoice_key}
                </div>
              )}
            </div>

            {/* Room Name */}
            <div>
              <label
                htmlFor="room_name"
                className="block text-sm font-medium mb-1"
              >
                Room Name:
              </label>
              <input
                type="text"
                id="room_name"
                name="room_name"
                value={formik.values.room_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
                readOnly
              />
              {formik.touched.room_name && formik.errors.room_name && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.room_name}
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
                  formik.setFieldValue(
                    "total_amount",
                    value +
                      formik.values.laundry_charge +
                      formik.values.other_charge +
                      formik.values.monthly_rent +
                      formik.values.security_deposit
                  );
                }}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.security_deposit &&
                formik.errors.security_deposit && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.security_deposit}
                  </div>
                )}
            </div>

            {/* Monthly Rent */}
            <div>
              <label
                htmlFor="monthly_rent"
                className="block text-sm font-medium mb-1"
              >
                Monthly Rent:
              </label>
              <input
                type="number"
                id="monthly_rent"
                name="monthly_rent"
                value={formik.values.monthly_rent}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  formik.setFieldValue("monthly_rent", value);
                  formik.setFieldValue(
                    "total_amount",
                    value +
                      formik.values.laundry_charge +
                      formik.values.other_charge +
                      formik.values.monthly_rent +
                      formik.values.security_deposit
                  );
                }}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.monthly_rent && formik.errors.monthly_rent && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.monthly_rent}
                </div>
              )}
            </div>

            {/* Electricity Charge */}
            <div>
              <label
                htmlFor="electricity_charge"
                className="block text-sm font-medium mb-1"
              >
                Electricity Charge:
              </label>
              <input
                type="number"
                id="electricity_charge"
                name="electricity_charge"
                value={formik.values.electricity_charge}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  formik.setFieldValue("electricity_charge", value);
                  formik.setFieldValue(
                    "total_charges",
                    value +
                      formik.values.laundry_charge +
                      formik.values.other_charge
                  );
                  formik.setFieldValue(
                    "total_amount",
                    value +
                      formik.values.laundry_charge +
                      formik.values.other_charge +
                      formik.values.monthly_rent +
                      formik.values.security_deposit
                  );
                }}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.electricity_charge &&
                formik.errors.electricity_charge && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.electricity_charge}
                  </div>
                )}
            </div>

            {/* Laundry Charge */}
            <div>
              <label
                htmlFor="laundry_charge"
                className="block text-sm font-medium mb-1"
              >
                Laundry Charge:
              </label>
              <input
                type="number"
                id="laundry_charge"
                name="laundry_charge"
                value={formik.values.laundry_charge}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  formik.setFieldValue("laundry_charge", value);
                  formik.setFieldValue(
                    "total_charges",
                    formik.values.electricity_charge +
                      value +
                      formik.values.other_charge
                  );
                  formik.setFieldValue(
                    "total_amount",
                    value +
                      formik.values.laundry_charge +
                      formik.values.other_charge +
                      formik.values.monthly_rent +
                      formik.values.security_deposit
                  );
                }}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.laundry_charge &&
                formik.errors.laundry_charge && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.laundry_charge}
                  </div>
                )}
            </div>

            {/* Other Charges */}
            <div>
              <label
                htmlFor="other_charge"
                className="block text-sm font-medium mb-1"
              >
                Other Charges:
              </label>
              <input
                type="number"
                id="other_charge"
                name="other_charge"
                value={formik.values.other_charge}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  formik.setFieldValue("other_charge", value);
                  formik.setFieldValue(
                    "total_charges",
                    formik.values.electricity_charge +
                      formik.values.laundry_charge +
                      value
                  );
                  formik.setFieldValue(
                    "total_amount",
                    value +
                      formik.values.laundry_charge +
                      formik.values.other_charge +
                      formik.values.monthly_rent +
                      formik.values.security_deposit
                  );
                }}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.other_charge && formik.errors.other_charge && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.other_charge}
                </div>
              )}
            </div>

            {/* Total Charges */}
            <div>
              <label
                htmlFor="total_charges"
                className="block text-sm font-medium mb-1"
              >
                Total Charges:
              </label>
              <input
                type="number"
                id="total_charges"
                name="total_charges"
                value={formik.values.total_charges}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
                readOnly
              />
              {formik.touched.total_charges && formik.errors.total_charges && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.total_charges}
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
                className="w-full p-2 bg-gray-800 text-white rounded"
                readOnly
              />
              {formik.touched.total_amount && formik.errors.total_amount && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.total_amount}
                </div>
              )}
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1">
                Year:
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formik.values.year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
                readOnly
              />
              {formik.touched.year && formik.errors.year && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.year}
                </div>
              )}
            </div>

            {/* Month */}
            <div>
              <label htmlFor="month" className="block text-sm font-medium mb-1">
                Month:
              </label>
              <input
                type="number"
                id="month"
                name="month"
                value={formik.values.month}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
                readOnly
              />
              {formik.touched.month && formik.errors.month && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.month}
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
                className="w-full p-2 bg-gray-800 text-white rounded"
                defaultValue={() => {
                  new Date().toISOString().replace("Z", "+5:30").split("T")[0];
                }}
              />
              {formik.touched.payment_date && formik.errors.payment_date && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.payment_date}
                </div>
              )}
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
                className="w-full p-2 bg-gray-800 text-white rounded"
                defaultValue="Cash"
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

            {/* Approved */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="approved"
                name="approved"
                checked={formik.values.approved}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mr-2"
              />
              <label htmlFor="approved" className="text-sm font-medium">
                Approved
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <button
                type="submit"
                className="w-full bg-white text-black p-2 rounded hover:bg-gray-200 transition"
              >
                Insert
              </button>
              <button
                type="button"
                className="w-full bg-gray-400 text-black p-2 rounded hover:bg-gray-200 transition"
                onClick={() => setToggleForm(false)}
              >
                Return to List
              </button>
            </div>
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
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">Data Updated</div>
            <Toast.Toggle />
          </Toast>
        </div>
      )}
    </div>
  );
};

export default CollectionForm;
