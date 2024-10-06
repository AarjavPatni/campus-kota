import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import StudentDetailsForm from "./StudentDetailsForm";

export function StudentList() {
  const [studentDetails, setStudentDetails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStudentUID, setSelectedStudentUID] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      let { data, error } = await supabase
        .from("student_details")
        .select("uid,room_number,first_name,student_mobile")
        .eq("active", true);

      if (error) {
        setError(error);
      } else {
        setStudentDetails(data);
      }
    };

    fetchStudentDetails();
  }, []);

  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div>
      {selectedStudentUID ? (
        <StudentDetailsForm uid={selectedStudentUID} />
      ) : (
        <div className="mx-auto max-w-screen-md">
          <Table striped>
            <TableHead>
              <TableHeadCell>Room Number</TableHeadCell>
              <TableHeadCell>Student Name</TableHeadCell>
              <TableHeadCell>Student Contact No.</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {studentDetails.map((student, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {student.room_number}
                  </TableCell>
                  <TableCell>{student.first_name}</TableCell>
                  <TableCell>{student.student_mobile}</TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      onClick={() => {
                        setSelectedStudentUID(
                          student.uid
                        );
                      }}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      ;
    </div>
  );
}
