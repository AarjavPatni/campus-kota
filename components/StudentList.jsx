import { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
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
import { ToggleSwitch } from "flowbite-react";
import CollectionForm from "./CollectionForm";

export function StudentList() {
  const [studentDetails, setStudentDetails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStudentUID, setSelectedStudentUID] = useState(null);
  const [collectionUID, setCollectionUID] = useState(null);
  const [showAllRecords, setShowAllRecords] = useState(false);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      let { data, error } = await supabase
        .from("student_details")
        .select("uid,room_number,first_name,student_mobile")
        .eq("active", true)
        .order('room_number', { ascending: true });

      if (showAllRecords) {
        ({ data, error } = await supabase
          .from("student_details")
          .select("uid,room_number,first_name,student_mobile")
          .order('room_number', { ascending: true }));
      }

      if (error) {
        setError(error);
      } else {
        setStudentDetails(data);
      }
    };

    fetchStudentDetails();
  }, [showAllRecords]);

  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div>
      {selectedStudentUID ? (
        <StudentDetailsForm uid={selectedStudentUID} />
      ) : collectionUID ? (
        <CollectionForm uid={collectionUID} returnToBill={false} />
      ) : (
        <div className="mx-auto max-w-screen-md flex flex-col gap-4">
          <ToggleSwitch
            checked={showAllRecords}
            label="Show Inactive Records"
            onChange={setShowAllRecords}
          />
          <Table striped>
            <TableHead>
              <TableHeadCell>Room Number</TableHeadCell>
              <TableHeadCell>Student Name</TableHeadCell>
              <TableHeadCell>Student Contact No.</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
                <span className="sr-only">Collect</span>
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
                        setSelectedStudentUID(student.uid);
                      }}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Edit
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      onClick={() => {
                        setCollectionUID(student.uid);
                      }}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Collect
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
