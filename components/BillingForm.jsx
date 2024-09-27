import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/supabaseClient";
import { StudentList } from "./StudentList";
import { BillingList } from "./BillingList";

const validationSchema = Yup.object({
  room_name: Yup.string().required("Room Name is required"),
  security_deposit: Yup.number().required("Security Deposit is required"),
  monthly_rent: Yup.number().required("Monthly Rent is required"),
  electricity_charge: Yup.number().required("Electricity Charge is required"),
  laundry_charge: Yup.number().required("Laundry Charge is required"),
  other_charge: Yup.number().required("Other Charge is required"),
  year: Yup.number().required("Year is required"),
  month: Yup.number().required("Month is required"),
  bill_date: Yup.date().required("Bill Date is required"),
  approved: Yup.boolean(),
});

const BillingForm = ({ bill_key }) => {
  const [billingDetails, setBillingDetails] = useState(null);
  const [toggleForm, setToggleForm] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      let { data: billing_details, error } = await supabase
        .from("billing")
        .select("*")
        .eq("bill_key", bill_key);

      if (error) {
        console.error("Error fetching billing data:", error);
      } else {
        setBillingDetails(billing_details[0]);
      }
    };

    fetchBillingData();
  }, [bill_key]);

  const formik = useFormik({
    initialValues: {
      ...billingDetails,
      room_name: billingDetails?.room_name || "",
      security_deposit: billingDetails?.security_deposit || 0,
      monthly_rent: billingDetails?.monthly_rent || 0,
      electricity_charge: billingDetails?.electricity_charge || 0,
      laundry_charge: billingDetails?.laundry_charge || 0,
      other_charge: billingDetails?.other_charge || 0,
      year: billingDetails?.year || new Date().getFullYear(),
      month: billingDetails?.month || new Date().getMonth() + 1,
      bill_date:
        billingDetails?.bill_date || new Date().toISOString().split("T")[0],
      approved: billingDetails?.approved || false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let resp, status;

      console.log(values);

      if (bill_key) {
        console.log(values, bill_key);
        const response = await supabase
          .from("billing")
          .update(values)
          .eq("bill_key", bill_key)
          .select();

        resp = response;
        status = resp.status;
      } else {
        const response = await supabase
          .from("billing")
          .insert([values])
          .select();

        resp = response;
        status = resp.status;
      }

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
    if (billingDetails) {
      formik.setValues(billingDetails);
    }
  }, [billingDetails]);

  return (
    <div>
      {toggleForm ? (
        <div className="bg-black text-white p-8 rounded-lg max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Billing Details Form</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                htmlFor="bill_date"
                className="block text-sm font-medium mb-1"
              >
                Bill Date:
              </label>
              <input
                type="date"
                id="bill_date"
                name="bill_date"
                value={formik.values.bill_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.bill_date && formik.errors.bill_date && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.bill_date}
                </div>
              )}
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
            {(bill_key && (
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <button
                  type="submit"
                  className="w-full bg-white text-black p-2 rounded hover:bg-gray-200 transition"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-400 text-black p-2 rounded hover:bg-gray-200 transition"
                  onClick={() => setToggleForm(null)}
                >
                  Return to List
                </button>
              </div>
            )) || (
              <button
                type="submit"
                className="w-full bg-white text-black p-2 rounded hover:bg-gray-200 transition"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      ) : (
        <BillingList />
      )}
    </div>
  );
};

export default BillingForm;
