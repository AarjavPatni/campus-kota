import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "../pages/supabaseClient";

const validationSchema = Yup.object({
  room_number: Yup.number().required("Room Number is required"),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  father_name: Yup.string().required("Father's Name is required"),
  course: Yup.string().required("Course is required"),
  institute: Yup.string().required("Institute is required"),
  student_mobile: Yup.string().required("Student Mobile is required"),
  parent_mobile: Yup.string().required("Parent Mobile is required"),
  guardian_mobile: Yup.string().required("Guardian Mobile is required"),
  remarks: Yup.string(),
  address: Yup.string().required("Address is required"),
  security_deposit: Yup.number().required("Security Deposit is required"),
  monthly_rent: Yup.number().required("Monthly Rent is required"),
  start_date: Yup.date().required("Start Date is required"),
  end_date: Yup.date().required("End Date is required"),
  approved: Yup.boolean(),
});

const Form = () => {
  const formik = useFormik({
    initialValues: {
      room_name: "",
      room_number: "",
      first_name: "",
      last_name: "",
      father_name: "",
      course: "",
      institute: "",
      student_mobile: "",
      parent_mobile: "",
      guardian_mobile: "",
      remarks: "",
      address: "",
      security_deposit: "",
      monthly_rent: "",
      start_date: "",
      end_date: "",
      approved: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Capitalize all fields except remarks
      const capitalize = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      const capitalizedValues = {
        ...values,
        room_number: values.room_number,
        first_name: capitalize(values.first_name),
        last_name: capitalize(values.last_name),
        father_name: capitalize(values.father_name),
        course: values.course.toUpperCase(),
        institute: capitalize(values.institute),
        student_mobile: values.student_mobile,
        parent_mobile: values.parent_mobile,
        guardian_mobile: values.guardian_mobile,
        remarks: values.remarks, // Do not capitalize
        address: capitalize(values.address),
        security_deposit: values.security_deposit,
        monthly_rent: values.monthly_rent,
        start_date: values.start_date,
        end_date: values.end_date,
        approved: values.approved,
      };
      capitalizedValues.room_name =
        capitalizedValues.room_number.toString() + capitalizedValues.first_name;

      const { data, status } = await supabase
        .from("student_details")
        .insert([capitalizedValues])
        .select();

      if (status === 201) {
        console.log("Data inserted successfully:", data);
        formik.resetForm();
        alert("Data inserted successfully");
      } else {
        console.error("Error inserting data:", status);
      }
    },
  });

  return (
    <div className="bg-black text-white p-8 rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Student Details Form</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="room_number"
            className="block text-sm font-medium mb-1"
          >
            Room Number:
          </label>
          <input
            type="number"
            id="room_number"
            name="room_number"
            value={formik.values.room_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.room_number && formik.errors.room_number && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.room_number}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium mb-1"
          >
            First Name:
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.first_name && formik.errors.first_name && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.first_name}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium mb-1">
            Last Name:
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.last_name && formik.errors.last_name && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.last_name}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="father_name"
            className="block text-sm font-medium mb-1"
          >
            Father's Name:
          </label>
          <input
            type="text"
            id="father_name"
            name="father_name"
            value={formik.values.father_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.father_name && formik.errors.father_name && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.father_name}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="course" className="block text-sm font-medium mb-1">
            Course:
          </label>
          <input
            type="text"
            id="course"
            name="course"
            value={formik.values.course}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.course && formik.errors.course && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.course}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="institute" className="block text-sm font-medium mb-1">
            Institute:
          </label>
          <input
            type="text"
            id="institute"
            name="institute"
            value={formik.values.institute}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.institute && formik.errors.institute && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.institute}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="student_mobile"
            className="block text-sm font-medium mb-1"
          >
            Student Mobile:
          </label>
          <input
            type="tel"
            id="student_mobile"
            name="student_mobile"
            value={formik.values.student_mobile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.student_mobile && formik.errors.student_mobile && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.student_mobile}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="parent_mobile"
            className="block text-sm font-medium mb-1"
          >
            Parent Mobile:
          </label>
          <input
            type="tel"
            id="parent_mobile"
            name="parent_mobile"
            value={formik.values.parent_mobile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.parent_mobile && formik.errors.parent_mobile && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.parent_mobile}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="guardian_mobile"
            className="block text-sm font-medium mb-1"
          >
            Guardian Mobile:
          </label>
          <input
            type="tel"
            id="guardian_mobile"
            name="guardian_mobile"
            value={formik.values.guardian_mobile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.guardian_mobile && formik.errors.guardian_mobile && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.guardian_mobile}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="remarks" className="block text-sm font-medium mb-1">
            Remarks:
          </label>
          <textarea
            id="remarks"
            name="remarks"
            value={formik.values.remarks}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.remarks && formik.errors.remarks && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.remarks}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address:
          </label>
          <textarea
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.address && formik.errors.address && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.address}
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
            htmlFor="start_date"
            className="block text-sm font-medium mb-1"
          >
            Start Date:
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formik.values.start_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.start_date && formik.errors.start_date && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.start_date}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium mb-1">
            End Date:
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formik.values.end_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          {formik.touched.end_date && formik.errors.end_date && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.end_date}
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
        <button
          type="submit"
          className="w-full bg-white text-black p-2 rounded hover:bg-gray-200 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
