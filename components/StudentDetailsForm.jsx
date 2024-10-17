import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/supabaseClient";
import { StudentList } from "./StudentList";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";

const validationSchema = Yup.object({
  room_number: Yup.number()
    .required("Room Number is required")
    .integer()
    .positive(),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  father_name: Yup.string().required("Father's Name is required"),
  course: Yup.string().required("Course is required"),
  institute: Yup.string().required("Institute is required"),
  student_mobile: Yup.string().required("Student Mobile is required"),
  email: Yup.string().required("Email is required").email(),
  parent_mobile: Yup.string().required("Parent Mobile is required"),
  guardian_mobile: Yup.string().required("Guardian Mobile is required"),
  remarks: Yup.string(),
  address: Yup.string().required("Address is required"),
  security_deposit: Yup.number()
    .required("Security Deposit is required")
    .integer()
    .positive(),
  monthly_rent: Yup.number()
    .required("Monthly Rent is required")
    .integer()
    .positive(),
  laundry_charge: Yup.number(),
  other_charge: Yup.number(),
  start_date: Yup.date().required("Start Date is required"),
  end_date: Yup.date(),
  active: Yup.boolean(),
  approved: Yup.boolean(),
});

const StudentDetailsForm = ({ uid }) => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [toggleForm, setToggleForm] = useState(true);
  const [toggleToast, setToggleToast] = useState(false);
  const [toastOpacity, setToastOpacity] = useState(0);

  console.log("uid", uid);

  useEffect(() => {
    if (uid) {
      const fetchStudentDetails = async () => {
        let { data: student_details, error } = await supabase
          .from("student_details")
          .select("*")
          .eq("uid", uid);

        if (error) {
          console.error("Error fetching student details:", error);
        } else {
          setStudentDetails(student_details[0]);
        }
      };

      fetchStudentDetails();
    }
  }, [uid]);

  const formik = useFormik({
    initialValues: {
      ...studentDetails,
      room_number: studentDetails?.room_number || "",
      first_name: studentDetails?.first_name || "",
      last_name: studentDetails?.last_name || "",
      father_name: studentDetails?.father_name || "",
      course: studentDetails?.course || "",
      institute: studentDetails?.institute || "",
      student_mobile: studentDetails?.student_mobile || "",
      email: studentDetails?.email || "",
      parent_mobile: studentDetails?.parent_mobile || "",
      guardian_mobile: studentDetails?.guardian_mobile || "",
      remarks: studentDetails?.remarks || "",
      address: studentDetails?.address || "",
      security_deposit: studentDetails?.security_deposit || "",
      monthly_rent: studentDetails?.monthly_rent || "",
      laundry_charge: studentDetails?.laundry_charge || 0,
      other_charge: studentDetails?.other_charge || 0,
      start_date: studentDetails?.start_date || "",
      end_date: studentDetails?.end_date || "9999-12-31",
      active: studentDetails?.active || true,
      approved: studentDetails?.approved || false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Capitalize all fields except remarks
      const capitalize = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      const capitalizedValues = {
        room_number: values.room_number,
        first_name: capitalize(values.first_name),
        last_name: capitalize(values.last_name),
        father_name: capitalize(values.father_name),
        course: values.course.toUpperCase(),
        institute: capitalize(values.institute),
        student_mobile: values.student_mobile,
        email: values.email,
        parent_mobile: values.parent_mobile,
        guardian_mobile: values.guardian_mobile,
        remarks: values.remarks,
        address: capitalize(values.address),
        security_deposit: values.security_deposit,
        monthly_rent: values.monthly_rent,
        laundry_charge: values.laundry_charge,
        other_charge: values.other_charge,
        start_date: values.start_date,
        end_date: values.end_date,
        active: values.active,
        approved: values.approved,
      };

      if (capitalizedValues.end_date === "") {
        capitalizedValues.end_date = "9999-12-31";
      }
      console.log(capitalizedValues);
      let resp, status;

      if (uid) {
        const response = await supabase
          .from("student_details")
          .update([capitalizedValues])
          .eq("uid", uid)
          .select();

        resp = response;
        status = resp.status;
      } else {
        const response = await supabase
          .from("student_details")
          .insert([capitalizedValues])
          .select();

        resp = response;
        status = resp.status;
      }

      const showToast = () => {
        setToggleToast(true);
        setTimeout(() => setToastOpacity(1), 10);

        setTimeout(() => {
          setToastOpacity(0);
          setTimeout(() => setToggleToast(false), 300);
          window.location.href = "/";
        }, 2000);
      };

      if (status === 201) {
        formik.resetForm();
        console.log("Data inserted successfully:", resp);
        showToast();
      } else if (status === 200) {
        formik.resetForm();
        console.log("Data updated successfully:", resp);
        showToast();
      } else {
        console.error("Error inserting data:", status);
        console.log(resp.error);
      }
    },
  });

  useEffect(() => {
    if (studentDetails) {
      formik.setValues(studentDetails);
    }
  }, [studentDetails]);

  return (
    <div>
      {toggleForm ? (
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
                readOnly={uid ? true : false}
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
                readOnly={uid ? true : false}
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.first_name}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium mb-1"
              >
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
              <label
                htmlFor="course"
                className="block text-sm font-medium mb-1"
              >
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
              <label
                htmlFor="institute"
                className="block text-sm font-medium mb-1"
              >
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
              {formik.touched.student_mobile &&
                formik.errors.student_mobile && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.student_mobile}
                  </div>
                )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
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
              {formik.touched.guardian_mobile &&
                formik.errors.guardian_mobile && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.guardian_mobile}
                  </div>
                )}
            </div>
            <div>
              <label
                htmlFor="remarks"
                className="block text-sm font-medium mb-1"
              >
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
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-1"
              >
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
                Other Charges:
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
              <label
                htmlFor="end_date"
                className="block text-sm font-medium mb-1"
              >
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
                id="active"
                name="active"
                checked={formik.values.active}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mr-2"
              />
              <label htmlFor="active" className="text-sm font-medium">
                Active
              </label>
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
            {(uid && (
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

export default StudentDetailsForm;
