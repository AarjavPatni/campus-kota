import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import supabase from "@/supabaseClient";
import { StudentList } from "./StudentList";
import { Toast, Button } from "flowbite-react";
import { HiChevronLeft, HiChevronRight, HiCheck, HiX, HiBeaker } from "react-icons/hi";
import { useStudent } from "@/context/StudentContext";
import { useRouter } from "next/router";
import Link from "next/link";

// validation schema
const validationSchema = Yup.object().shape({
  original_room: Yup.number().required("Room Number is required").integer().positive().max(299, "Max is 299"),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  father_name: Yup.string().required("Father's Name is required"),
  course: Yup.string().required("Course is required"),
  institute: Yup.string().required("Institute is required"),
  student_mobile: Yup.string()
    .required("Student Mobile is required")
    .matches(/^[0-9]+$/, "Must be a valid number"),
  email: Yup.string().required("Email is required").email("Invalid email"),
  parent_mobile: Yup.string()
    .required("Parent Mobile is required")
    .matches(/^[0-9]+$/, "Must be a valid number"),
  guardian_mobile: Yup.string()
    .required("Guardian Mobile is required")
    .matches(/^[0-9]+$/, "Must be a valid number"),
  remarks: Yup.string().nullable(),
  address: Yup.string().required("Address is required"),
  security_deposit: Yup.number().required("Security Deposit is required").integer(),
  monthly_rent: Yup.number().required("Monthly Rent is required").integer().positive(),
  laundry_charge: Yup.number(),
  other_charge: Yup.number(),
  start_date: Yup.date().required("Start Date is required"),
  end_date: Yup.date(),
  active: Yup.boolean(),
  approved: Yup.boolean(),
});

// Add field label mapping
const FIELD_LABELS = {
  original_room: "Room Number",
  laundry_charge: "Laundry, Wifi, Etc"
};

export default function StudentDetailsForm({ refreshStudents }) {
  const [step, setStep] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const stepRef = useRef(null);
  const measureRefs = useRef([]);
  const [toggleToast, setToggleToast] = useState(false);
  const [toastOpacity, setToastOpacity] = useState(1);
  const [toastMessage, setToastMessage] = useState({ text: "", type: "" });

  const { selectedStudent, setSelectedStudent } = useStudent();
  const router = useRouter();
  const fromInsert = router.pathname === "/insert";

  const steps = [
    ["first_name", "last_name", "student_mobile", "active", "approved"],
    ["original_room", "father_name", "email", "start_date", "address"],
    ["parent_mobile", "guardian_mobile", "course", "institute", ...(selectedStudent ? ["remarks"] : [])],
    ["monthly_rent", ...(selectedStudent ? ["security_deposit"] : []), "laundry_charge", ...(selectedStudent ? ["end_date"] : [])],
  ];

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: selectedStudent || {
      original_room: "",
      first_name: "",
      last_name: "",
      father_name: "",
      course: "",
      institute: "",
      student_mobile: "",
      email: "",
      parent_mobile: "",
      guardian_mobile: "",
      remarks: "",
      address: "",
      security_deposit: "",
      monthly_rent: "",
      laundry_charge: "",
      other_charge: 0,
      start_date: new Date().toISOString().split("T")[0],
      end_date: "2026-12-31",
      active: true,
      approved: false,
    },
  });

  // Watch monthly_rent and update security_deposit for new entries
  const monthlyRent = watch("monthly_rent");
  useEffect(() => {
    if (!selectedStudent && monthlyRent) {
      setValue("security_deposit", monthlyRent);
    }
  }, [monthlyRent, selectedStudent, setValue]);

  useEffect(() => {
    if (selectedStudent) reset(selectedStudent);
  }, [selectedStudent]);

  // measure tallest step (all steps)
  useEffect(() => {
    // Create refs for each step
    measureRefs.current = measureRefs.current.slice(0, steps.length);
    // After rendering, measure all step heights
    setTimeout(() => {
      const heights = measureRefs.current.map(ref => ref?.clientHeight || 0);
      setMaxHeight(Math.max(...heights, 0));
    }, 0);
  }, [steps, selectedStudent]);

  const capitalize = str =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const getChanges = (oldData, newData) => {
    const changes = {};
    Object.keys(newData).forEach(key => {
      let oldVal = oldData[key];
      let newVal = newData[key];
      if (oldVal !== newVal) changes[key] = { old: oldVal, new: newVal };
    });
    return changes;
  };

  const sendUpdatedInfoEmail = async (changes, values) => {
    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: "records@campuskota.in",
        subject: "Student Record Update",
        detailsChanges: changes,
        student: values,
      })
    });
  };

  const sendNewEntryEmail = async values => {
    try {
      // Send to student
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: values.email,
          first_name: values.first_name,
          ...values,
          bcc: "campuskota@outlook.com",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Sending email...")
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending new entry email:', error);
      // Optionally handle the error in the UI or rethrow it
      throw error;
    }
  };

  const handleSaveAndEmail = async (e) => {
    e.preventDefault();
    console.log('Save and Email clicked');
    const isValid = await trigger();
    console.log('Form validation result:', isValid);
    if (isValid) {
      await handleSubmit((values) => onSubmit(values, true))();
    } else {
      // Show error summary for all fields
      const errorMessages = Object.values(errors)
        .map(e => e?.message)
        .filter(Boolean)
        .join('; ');

      console.log("errors", errorMessages);

      setToastMessage({
        text: errorMessages || "Please fix the errors above.",
        type: "error"
      });

      setToggleToast(true);
      setToastOpacity(1);
    }
  };

  const onSubmit = async (values, shouldSendEmail = false) => {
    console.log('onSubmit called with values:', values);
    if (!values) {
      console.error('No values provided to onSubmit');
      return;
    }
    // empty to 0
    [
      "original_room",
      "security_deposit",
      "monthly_rent",
      "laundry_charge",
      "other_charge",
    ].forEach(f => {
      if (values[f] === "") values[f] = 0;
    });
    // capitalize
    const caps = {
      first_name: capitalize(values.first_name),
      last_name: capitalize(values.last_name),
      father_name: capitalize(values.father_name),
      course: values.course.toUpperCase(),
      institute: capitalize(values.institute),
      address: capitalize(values.address),
      ...values,
    };

    // Normalize date fields
    ["start_date", "end_date"].forEach(field => {
      if (caps[field] instanceof Date) {
        const d = caps[field];
        caps[field] = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }
    });

    console.log('Processed data:', caps);
    try {
      let res;
      const { room_name, ...updateData } = caps;

      if (selectedStudent) {
        console.log('Updating student with data:', updateData);
        res = await supabase.from("student_details").update(updateData).eq("uid", selectedStudent.uid);
      } else {
        caps.security_deposit = caps.monthly_rent;
        caps.end_date = "2026-12-31";
        caps.remarks = "";
        console.log('Inserting new student with data:', caps);
        res = await supabase.from("student_details").insert([caps]);
      }

      console.log('Database response:', res);
      if (res.error) throw res.error;
      // email logic
      if (selectedStudent) {
        const changes = getChanges(selectedStudent, caps);
        console.log('Changes detected:', changes);
        if (Object.keys(changes).length) await sendUpdatedInfoEmail(changes, caps);
      }

      if (shouldSendEmail) {
        console.log('Sending new entry email to:', caps.email);
        await sendNewEntryEmail(caps);
      }

      setToastMessage({ text: "Data saved!", type: "success" });
      setToggleToast(true);
      setToastOpacity(1);
      if (!selectedStudent) {
        setTimeout(async () => {
          if (refreshStudents) await refreshStudents();
          router.push('/admin');
        }, 1000);
      } else {
        setTimeout(async () => {
          if (refreshStudents) await refreshStudents();
          setSelectedStudent(null);
          reset();
        }, 1000);
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      setToastMessage({ text: `Error: ${err.message}\nPress Admin to exit.`, type: "error" });
      setToggleToast(true);
      setToastOpacity(1);
    }
  };

  // Add function to check if phone number exists
  const checkPhoneNumberExists = async (phoneNumber) => {
    const { data, error } = await supabase
      .from("student_details")
      .select("student_mobile")
      .eq("student_mobile", phoneNumber)
      .single();
    
    return !error && data;
  };

  // Modify next function to handle initial validation
  const next = async () => {
    if (step === 0 && !selectedStudent) {
      // For new entries, validate first step and check phone number
      const isValid = await trigger(["first_name", "last_name", "student_mobile"]);
      if (isValid) {
        const phoneNumber = watch("student_mobile");
        const exists = await checkPhoneNumberExists(phoneNumber);
        if (exists) {
          setToastMessage({ 
            text: "Record already exists!", 
            type: "error" 
          });
          setToggleToast(true);
          setToastOpacity(1);
          return;
        }
      } else {
        // Show error summary for current step
        const stepFields = ["first_name", "last_name", "student_mobile"];
        const errorMessages = stepFields
          .map(f => errors[f]?.message)
          .filter(Boolean)
          .join("; ");
        setToastMessage({
          text: errorMessages || "Please fix the errors above.",
          type: "error"
        });
        setToggleToast(true);
        setToastOpacity(1);
        return;
      }
    }

    if (await trigger(steps[step])) {
      setStep(s => s + 1);
      // Dismiss error toast when moving to next stage
      setToastOpacity(0);
      setToggleToast(false);
    } else {
      // Show error summary for current step
      const stepFields = steps[step];
      const errorMessages = stepFields
        .map(f => errors[f]?.message)
        .filter(Boolean)
        .join("; ");
      setToastMessage({
        text: errorMessages || "Please fix the errors above.",
        type: "error"
      });
      setToggleToast(true);
      setToastOpacity(1);
    }
  };

  const prev = () => step > 0 && setStep(s => s - 1);

  useEffect(() => {
    if (toastOpacity === 1 && toastMessage.type === "success") {
      const t = setTimeout(() => setToastOpacity(0), 3000);
      return () => clearTimeout(t);
    }
  }, [toastOpacity, toastMessage.type]);

  const generateTestData = () => {
    const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emma", "James", "Sophia", "William", "Olivia", "Benjamin", "Ava", "Lucas", "Mia", "Henry", "Charlotte", "Alexander", "Amelia", "Daniel", "Harper", "Matthew", "Evelyn", "Joseph", "Abigail", "Samuel", "Emily", "Jackson", "Elizabeth", "Sebastian", "Ella", "David", "Scarlett", "Carter", "Grace", "Wyatt", "Chloe", "Jayden", "Victoria", "Gabriel", "Riley", "Owen", "Aria", "Dylan", "Lily", "Luke", "Hannah", "Anthony", "Natalie", "Isaac", "Zoe"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];
    const courses = ["B.Tech", "MCA", "MBA", "BBA", "BCA", "M.Tech", "B.Sc", "M.Sc", "B.Com", "M.Com", "B.A", "M.A", "B.Arch", "M.Arch", "B.Pharm", "M.Pharm", "BDS", "MDS", "MBBS", "MD", "B.Ed", "M.Ed", "LLB", "LLM", "BFA", "MFA", "BHM", "MHM", "BMS", "MMS", "B.Des", "M.Des", "B.Plan", "M.Plan", "BBA-LLB", "MBA-LLB", "B.Sc Nursing", "M.Sc Nursing", "BPT", "MPT"];
    const institutes = ["IIT", "NIT", "DTU", "NSIT", "IIIT", "IPU", "AIIMS", "JNU", "DU", "BHU", "AMU", "JMI", "BITS", "VIT", "SRM", "Manipal", "Symbiosis", "Christ", "Xavier", "Loyola", "St. Stephen's", "Hindu", "Presidency", "Fergusson", "St. Xavier's", "Pune", "Anna", "Osmania", "Punjab", "Calcutta", "Madras", "Bombay", "Delhi", "Hyderabad", "Bangalore", "Punjab", "Rajasthan", "Gujarat", "Kerala", "Tamil Nadu"];
    
    const randomData = {
      original_room: Math.floor(Math.random() * 299) + 1,
      first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
      last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
      father_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      course: courses[Math.floor(Math.random() * courses.length)],
      institute: institutes[Math.floor(Math.random() * institutes.length)],
      student_mobile: `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      email: `delivered+${Math.floor(Math.random() * 1000)}@resend.dev`,
      parent_mobile: `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      guardian_mobile: `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      address: `${Math.floor(Math.random() * 100)} Main Street, City ${Math.floor(Math.random() * 1000)}`,
      monthly_rent: Math.floor(Math.random() * 5000) + 5000,
      laundry_charge: Math.floor(Math.random() * 500),
      start_date: new Date().toISOString().split('T')[0],
      active: true,
      approved: false
    };

    reset(randomData);
  };

  if (!selectedStudent && !fromInsert) return <StudentList />;

  return (
    <div className="bg-black text-white p-8 rounded-lg max-w-lg mx-auto">
      {/* Hidden step containers for measuring heights */}
      <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', height: 0, overflow: 'hidden' }}>
        {steps.map((fields, idx) => (
          <div key={idx} ref={el => measureRefs.current[idx] = el}>
            {fields.map(field => (
              <div key={field} className="mb-4">
                {!(field === 'active' || field === 'approved') && (
                  <label htmlFor={field} className="block text-sm font-medium mb-1">
                    {FIELD_LABELS[field] || capitalize(field.replace(/_/g, ' '))}:
                  </label>
                )}
                {(field === 'remarks' || field === 'address') ? (
                  <textarea id={field} className="w-full p-2 bg-gray-800 text-white rounded" />
                ) : (field === 'active' || field === 'approved') ? (
                  <div className="flex items-center">
                    <input id={field} type="checkbox" className="mr-2" />
                    <label htmlFor={field} className="text-sm font-medium">{capitalize(field)}</label>
                  </div>
                ) : (
                  <input 
                    id={field} 
                    type={field.includes('date') ? 'date' : field === 'email' ? 'email' : field.includes('mobile') ? 'tel' : 'text'} 
                    className={`w-full p-2 text-white rounded bg-gray-800`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Actual form UI */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          {selectedStudent && (
            <Button 
              onClick={() => {
                if (selectedStudent) {
                  setSelectedStudent(null);
                } else {
                  reset();
                }
              }} 
              color="gray" 
              size="sm"
            >
              Back
            </Button>
          )}
          {(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') && !selectedStudent && (
            <Button onClick={generateTestData} color="success" size="sm" className="flex items-center justify-center p-0">
              <HiBeaker className="h-5 w-5"/>
            </Button>
          )}
        </div>
        {!selectedStudent && (
          <Link href="/admin" prefetch>
            <Button 
              color="purple" 
              size="sm"
              onClick={() => setSelectedStudent(null)}
            >
              Admin
            </Button>
          </Link>
        )}
      </div>
      <form onSubmit={selectedStudent ? handleSubmit((values) => onSubmit(values, false)) : handleSaveAndEmail} className="space-y-4">
        <div ref={stepRef} style={{ minHeight: maxHeight ? `${maxHeight}px` : 'auto' }}>
          {steps[step].map(field => (
            <div key={field} className="mb-4">
              {!(field === 'active' || field === 'approved') && (
                <label htmlFor={field} className="block text-sm font-medium mb-1">
                  {FIELD_LABELS[field] || capitalize(field.replace(/_/g, ' '))}:
                </label>
              )}
              {(field === 'remarks' || field === 'address') ? (
                <textarea id={field} {...register(field)} className="w-full p-2 bg-gray-800 text-white rounded" />
              ) : (field === 'active' || field === 'approved') ? (
                <div className="flex items-center">
                  <input id={field} type="checkbox" {...register(field)} className="mr-2" />
                  <label htmlFor={field} className="text-sm font-medium">{capitalize(field)}</label>
                </div>
              ) : (
                <input 
                  id={field} 
                  type={field.includes('date') ? 'date' : field === 'email' ? 'email' : field.includes('mobile') ? 'tel' : 'text'} 
                  {...register(field)} 
                  className={`w-full p-2 text-white rounded ${(field === 'first_name' || field === 'student_mobile') && selectedStudent ? 'bg-gray-700 opacity-60 cursor-not-allowed' : 'bg-gray-800'}`}
                  disabled={(field === 'first_name' || field === 'student_mobile') && selectedStudent}
                />
              )}
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field].message}</p>}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={prev} disabled={step === 0} color="gray" size="sm"><HiChevronLeft size={24} /></Button>
          {step < steps.length - 1 ? (
            <Button onClick={next} color="gray" size="sm"><HiChevronRight size={24} /></Button>
          ) : (
            <>
              <Button type="submit" color="success" className="hover:brightness-110">{selectedStudent ? 'Update' : 'Save & Email'}</Button>
              {!selectedStudent && (
                <Button onClick={handleSubmit((values) => onSubmit(values, false))} color="gray" size="sm">Save</Button>
              )}
            </>
          )}
        </div>
      </form>
      {toggleToast && (
        <div className="fixed bottom-28 right-4 z-50 transition-opacity" style={{ opacity: toastOpacity }}>
          <Toast className="flex items-center bg-white shadow-lg rounded-lg p-4">
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastMessage.type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
              {toastMessage.type === 'success' ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
            </div>
            <div className="ml-3 text-sm font-normal">{toastMessage.text}</div>
            <Toast.Toggle onDismiss={() => { setToggleToast(false); setToastOpacity(0); }} />
          </Toast>
        </div>
      )}
    </div>
  );
}
