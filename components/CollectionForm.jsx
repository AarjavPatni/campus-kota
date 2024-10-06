import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/supabaseClient";
import { StudentList } from "./StudentList";
import { BillingList } from "./BillingList";

const validationSchema = Yup.object({
  room_name: Yup.string().required("Room Name is required"),
  invoice_key: Yup.string().required("Invoice Key is required"),
  security_deposit: Yup.number().required("Security Deposit is required"),
  monthly_rent: Yup.number().required("Monthly Rent is required"),
  electricity_charge: Yup.number().required("Electricity Charge is required"),
  laundry_charge: Yup.number().required("Laundry Charge is required"),
  other_charge: Yup.number().required("Other Charge is required"),
  year: Yup.number().required("Year is required"),
  month: Yup.number().required("Month is required"),
  payment_date: Yup.date().required("Payment Date is required"),
  payment_method: Yup.string().required("Payment Method is required"),
  approved: Yup.boolean(),
});

const CollectionForm = ({ uid, returnToBill = true }) => {
  const [collectionDetails, setCollectionDetails] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [toggleForm, setToggleForm] = useState(true);
  const [nextInvoiceKey, setNextInvoiceKey] = useState(null);

  useEffect(() => {
    const fetchPastCollections = async () => {
      let { data: collection_data, error: collection_error } = await supabase
        .from("collection")
        .select("invoice_key")
        .eq("uid", uid);

      let { data: student_details, error: student_error } = await supabase
        .from("student_details")
        .select("*")
        .eq("uid", uid);

      if (student_error) {
        console.error("Error fetching student details:", student_error);
      } else {
        setStudentDetails(student_details[0]);
      }

      if (collection_error) {
        console.error("Error fetching collection data:", collection_error);
      } else if (collection_data.length > 0) {
        setCollectionDetails(collection_data[0]);
        const nextInvoiceKey = `${new Date().getFullYear()}-${uid}-${
          collection_data[0].invoice_key.split("-")[-1] + 1
        }`;
        setNextInvoiceKey(nextInvoiceKey);
      } else {
        setCollectionDetails(null);
        const nextInvoiceKey = `${new Date().getFullYear()}-${uid}-1`;
        setNextInvoiceKey(nextInvoiceKey);
      }
    };

    fetchPastCollections();
  }, [uid]);

  const formik = useFormik({
    initialValues: {
      ...studentDetails,
      invoice_key: nextInvoiceKey || "",
      room_name: studentDetails?.room_name || "",
      security_deposit: 0,
      monthly_rent: 0,
      electricity_charge: 0,
      laundry_charge: 0,
      other_charge: 0,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      payment_date: new Date()
        .toISOString()
        .replace("Z", "+05:30")
        .split("T")[0],
      payment_method: "",
      approved: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let resp, status;
      console.log("TEST");
      console.log(values);

      const response = await supabase
        .from("collection")
        .insert([values])
        .select();

      resp = response;
      status = resp.status;

      if (status === 201) {
        formik.resetForm();
        console.log("Data inserted successfully:", resp);
        alert("Data inserted successfully");
      } else if (status === 200) {
        formik.resetForm();
        console.log("Data updated successfully:", resp);
        alert("Data updated successfully");
      } else {
        console.error("Error inserting/updating data:", status);
        console.log(resp.error);
      }
    },
  });

  useEffect(() => {
    if (collectionDetails || studentDetails) {
      formik.setValues({
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
                readOnly={true}
              />
              {formik.touched.invoice_key && formik.errors.invoice_key && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.invoice_key}
                </div>
              )}
            </div>
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
                readOnly={true}
              />
              {formik.touched.room_name && formik.errors.room_name && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.room_name}
                </div>
              )}
            </div>
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
                onChange={formik.handleChange}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.monthly_rent && formik.errors.monthly_rent && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.monthly_rent}
                </div>
              )}
            </div>
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
                onChange={formik.handleChange}
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
                onChange={formik.handleChange}
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
            <div>
              <label
                htmlFor="other_charge"
                className="block text-sm font-medium mb-1"
              >
                Other Charge:
              </label>
              <input
                type="number"
                id="other_charge"
                name="other_charge"
                value={formik.values.other_charge}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.other_charge && formik.errors.other_charge && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.other_charge}
                </div>
              )}
            </div>
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
              />
              {formik.touched.year && formik.errors.year && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.year}
                </div>
              )}
            </div>
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
              />
              {formik.touched.month && formik.errors.month && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.month}
                </div>
              )}
            </div>
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.payment_date && formik.errors.payment_date && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.payment_date}
                </div>
              )}
            </div>
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
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
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
                onClick={() => setToggleForm(null)}
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
    </div>
  );
};

export default CollectionForm;
