import { Button } from "flowbite-react";
import supabase from "@/supabaseClient";
import { useCallback, useState } from "react";

export const BillGenerator = () => {
  const firstDateOfMonth = new Date(
    Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1)
  )
    .toISOString()
    .split("T")[0];

  const firstDateOfNextMonth = new Date(
    Date.UTC(new Date().getFullYear(), new Date().getMonth() + 1, 1)
  )
    .toISOString()
    .split("T")[0];

  const firstDateOfPrevMonth = new Date(
    Date.UTC(new Date().getFullYear(), new Date().getMonth() - 1, 1)
  )
    .toISOString()
    .split("T")[0];

  const generateBill = useCallback(() => {
    const fetchStudentDetails = async (start, end) => {
      // Gets all students living during the month of start.
      // Assumes that the minimum length of stay is 1 month.
      let { data: student_details, error } = await supabase
        .from("student_details")
        .select("*")
        .lt("start_date", start)
        .gte("end_date", end);

      const startYear = start.split("-")[0];
      const startMonth = start.split("-")[1];
      const currYear = firstDateOfMonth.split("-")[0];
      const currMonth = firstDateOfMonth.split("-")[1];

      if (error) {
        console.error("Error fetching student details:", error);
      } else {
        student_details.forEach(async (student) => {
          // Calculate prorated rent if needed
          let monthly_rent = student.monthly_rent;
          
          // For new records, we need to check against the billing month (end)
          const billingYear = Number(end.split("-")[0]);
          const billingMonth = Number(end.split("-")[1]);
          
          // Check if student is leaving mid-month
          if (
            Number(student.end_date.split("-")[1]) === billingMonth &&
            Number(student.end_date.split("-")[0]) === billingYear
          ) {
            const firstDayOfMonth = new Date(Date.UTC(billingYear, billingMonth - 1, 1));
            const days_diff =
              (Date.parse(student.end_date) - Date.parse(firstDayOfMonth)) /
                (1000 * 60 * 60 * 24) +
              1;
            monthly_rent = Math.ceil(student.monthly_rent * (days_diff / 30));
          }
          
          // Check if student is joining mid-month
          if (
            Number(student.start_date.split("-")[1]) === billingMonth &&
            Number(student.start_date.split("-")[0]) === billingYear
          ) {
            const lastDateOfMonth = new Date(Date.UTC(billingYear, billingMonth, 0));
            const days_diff =
              (Date.parse(lastDateOfMonth) - Date.parse(student.start_date)) /
                (1000 * 60 * 60 * 24) +
              1;
            monthly_rent = Math.ceil(student.monthly_rent * (days_diff / 30));
          }

          const response = await supabase
            .from("billing")
            .insert([
              {
                uid: student.uid,
                room_name: student.room_name,
                monthly_rent: monthly_rent,
                security_deposit:
                  startYear === currYear && startMonth === currMonth
                    ? student.security_deposit
                    : 0,
                laundry_charge: student.laundry_charge,
                other_charge: student.other_charge,
                year: end.split("-")[0],
                month: end.split("-")[1],
                bill_date: new Date().toISOString().split("T")[0],
                approved: student.approved,
              },
            ])
            .select();

          if (response.status === 201) {
            console.log("Data inserted successfully:", response.status);
          } else if (response.status === 409) {
            console.log("Data already exists:", response.status);
          } else {
            console.error(response);
          }
        });
      }
    };

    fetchStudentDetails(firstDateOfNextMonth, firstDateOfMonth);
    fetchStudentDetails(firstDateOfMonth, firstDateOfPrevMonth);
  }, [firstDateOfPrevMonth, firstDateOfMonth, firstDateOfNextMonth]);

  return (
    <span>
      <div className="flex gap-4 justify-center mb-4">
        <Button
          role="button"
          className="w-30 font-medium text-sm text-center duration-150"
          color={"gray"}
          onClick={() => {
            generateBill();
          }}
        >
          Generate Bill
        </Button>

        <Button
          href="/admin"
          className="w-20 font-medium text-sm text-center duration-150"
          color={"gray"}
        >
          Admin
        </Button>
      </div>
    </span>
  );
};
