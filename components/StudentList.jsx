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
  Button,
} from "flowbite-react";
import StudentDetailsForm from "./StudentDetailsForm";
import CollectionForm from "./CollectionForm";
import { useStudent } from "@/context/StudentContext";

export function StudentList() {
  const [allStudents, setAllStudents] = useState([]);
  const [error, setError] = useState(null);
  const [collectionUID, setCollectionUID] = useState(null);
  const [showActiveRecords, setShowActiveRecords] = useState(true);
  const { selectedStudent, setSelectedStudent } = useStudent();

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("student_details")
        .select("*")
        .order('original_room', { ascending: true });

      if (error) {
        setError(error);
      } else {
        setAllStudents(data);
      }
    };

    fetchStudents();
  }, []);

  if (error) return <div>Error fetching data: {error.message}</div>;

  const studentDetails = showActiveRecords 
    ? allStudents.filter(student => student.active)
    : allStudents;

  return (
    <div>
      {selectedStudent ? (
        <StudentDetailsForm />
      ) : collectionUID ? (
        <CollectionForm uid={collectionUID} returnToBill={false} />
      ) : (
        <div className="mx-auto max-w-screen-md flex flex-col gap-4">
          <div className="mb-4">
            <Button
              color={showActiveRecords ? "success" : "gray"}
              onClick={() => setShowActiveRecords(!showActiveRecords)}
              size="sm"
            >
              {showActiveRecords ? "Active Only" : "All Records"}
            </Button>
          </div>
          <Table striped>
            <TableHead>
              <TableHeadCell>Room-Student</TableHeadCell>
              <TableHeadCell>Student Contact No.</TableHeadCell>
              <TableHeadCell></TableHeadCell>
              <TableHeadCell></TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {studentDetails.map((student, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {`${student.original_room}-${student.first_name}`}
                  </TableCell>
                  <TableCell>{student.student_mobile}</TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      onClick={() => {
                        setSelectedStudent(student);
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
    </div>
  );
}
