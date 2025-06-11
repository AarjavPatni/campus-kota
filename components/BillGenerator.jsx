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

      console.log(startYear === currYear && startMonth === currMonth);
      console.log(startYear, startMonth, currYear, currMonth);

      if (error) {
        console.error("Error fetching student details:", error);
      } else {
        student_details.forEach(async (student) => {
          const response = await supabase
            .from("billing")
            .insert([
              {
                uid: student.uid,
                room_name: student.room_name,
                monthly_rent: student.monthly_rent,
                security_deposit:
                  startYear === currYear && startMonth === currMonth
                    ? student.security_deposit
                    : 0,
                laundry_charge: student.laundry_charge,
                other_charge: student.other_charge,
                year: end.split("-")[0], // ! is this correct?
                month: end.split("-")[1], // ! is this correct?
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

  const updateBill = useCallback(
    async (record_month, record_year) => {
      let { data: monthly_bill, error } = await supabase
        .from("billing")
        .select("*")
        .eq("year", record_year)
        .eq("month", record_month);

      if (error) {
        console.error("Error fetching monthly bill:", error);
        return;
      }

      monthly_bill.forEach(async (bill) => {
        const response = await supabase
          .from("student_details")
          .select("start_date,end_date,monthly_rent")
          .eq("uid", bill.uid)
          .single();

        const monthly_rent = response.data.monthly_rent;
        const start_date = response.data.start_date;
        const end_date = response.data.end_date;
        const lastDateOfMonth = new Date(
          Date.UTC(record_year, record_month, 0)
        );

        if (
          Number(end_date.split("-")[1]) === record_month &&
          Number(end_date.split("-")[0]) === record_year
        ) {
          const days_diff =
            (Date.parse(end_date) - Date.parse(firstDateOfMonth)) /
              (1000 * 60 * 60 * 24) +
            1;

          console.log("days: ", days_diff);

          const new_rent = Math.ceil(monthly_rent * (days_diff / 30));
          console.log("new_rent end_date", new_rent);

          const response = await supabase
            .from("billing")
            .update({ monthly_rent: new_rent })
            .eq("uid", bill.uid)
            .eq("year", record_year)
            .eq("month", record_month);

          if (response.status === 204) {
            console.log("new_rent end_date updated", new_rent);
          } else {
            console.error("Error updating end_date:", response.body);
          }
        }

        if (
          Number(start_date.split("-")[1]) === record_month &&
          Number(start_date.split("-")[0]) === record_year
        ) {
          const days_diff =
            (Date.parse(lastDateOfMonth) - Date.parse(start_date)) /
              (1000 * 60 * 60 * 24) +
            1;

          const new_rent = Math.ceil(monthly_rent * (days_diff / 30));
          console.log("new_rent start_date", new_rent);

          const response = await supabase
            .from("billing")
            .update({ monthly_rent: new_rent })
            .eq("uid", bill.uid)
            .eq("year", record_year)
            .eq("month", record_month);

          if (response.status === 204) {
            console.log("new_rent end_date updated", new_rent);
          } else {
            console.error("Error updating end_data:", response.body);
          }
        }
      });
    },
    [firstDateOfMonth]
  );

  return (
    <span>
      <div className="flex gap-4 justify-center mb-4">
        <Button
          role="button"
          className="w-30 font-medium text-sm text-center duration-150"
          color={"gray"}
          onClick={() => {
            generateBill();
            // !! Handle December dates
            updateBill(new Date().getMonth() + 1, new Date().getFullYear());
            updateBill(new Date().getMonth() - 1, new Date().getFullYear());
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
