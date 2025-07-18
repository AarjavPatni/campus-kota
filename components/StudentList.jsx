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
import { HiCurrencyRupee, HiOutlineLogout } from "react-icons/hi";

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
        .select("*");

      if (error) {
        setError(error);
      } else {
        // Sort by active first, then by original_room
        const sorted = data.sort((a, b) => {
          if (a.active === b.active) {
            // Compare room numbers as numbers if possible
            const roomA = isNaN(Number(a.original_room)) ? a.original_room : Number(a.original_room);
            const roomB = isNaN(Number(b.original_room)) ? b.original_room : Number(b.original_room);
            if (roomA < roomB) return -1;
            if (roomA > roomB) return 1;
            return 0;
          }
          return b.active - a.active; // active students first
        });
        setAllStudents(sorted);
      }
    };

    fetchStudents();
    // Expose fetchStudents for refresh
    StudentList.fetchStudents = fetchStudents;
  }, []);

  // Add a refresh function to pass to StudentDetailsForm
  const refreshStudents = async () => {
    const { data, error } = await supabase
      .from("student_details")
      .select("*");
    if (!error) {
      // Sort by active first, then by original_room
      const sorted = data.sort((a, b) => {
        if (a.active === b.active) {
          const roomA = isNaN(Number(a.original_room)) ? a.original_room : Number(a.original_room);
          const roomB = isNaN(Number(b.original_room)) ? b.original_room : Number(b.original_room);
          if (roomA < roomB) return -1;
          if (roomA > roomB) return 1;
          return 0;
        }
        return b.active - a.active;
      });
      setAllStudents(sorted);
    }
  };

  if (error) return <div>Error fetching data: {error.message}</div>;

  const studentDetails = showActiveRecords 
    ? allStudents.filter(student => student.active)
    : allStudents;

  return (
    <div>
      {selectedStudent ? (
        <StudentDetailsForm refreshStudents={refreshStudents} />
      ) : collectionUID ? (
        <CollectionForm uid={collectionUID} returnToBill={false} />
      ) : (
        <div className="mx-auto max-w-screen-md flex flex-col gap-4">
          <div className="mb-2 flex items-center justify-between xs:px-6 md:px-0">
            <Button
              color={showActiveRecords ? "success" : "gray"}
              onClick={() => setShowActiveRecords(!showActiveRecords)}
              size="sm"
              className="w-28 md:w-auto"
            >
              {showActiveRecords ? "Active Only" : "All Records"}
            </Button>
            <Link href="/admin" prefetch>
              <Button
                color="purple"
                size="sm"
                className="w-20 md:w-auto"
              >
                Admin
              </Button>
            </Link>
          </div>
          {/* Card view for mobile */}
          <div className="block md:hidden space-y-2">
            {studentDetails.map((student, index) => (
              <div
                key={index}
                className="bg-white text-black rounded-md shadow flex items-center justify-between px-3 py-2 max-w-xs mx-auto"
              >
                <div className="flex flex-col">
                  <button
                    className="text-base font-semibold text-blue-700 text-left p-0 m-0 hover:underline"
                    onClick={() => setSelectedStudent(student)}
                  >
                    {`${student.original_room}-${student.first_name}`}
                  </button>
                  <span className="text-sm text-gray-700">{student.student_mobile}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="success"
                    className="rounded-full p-2 h-9 w-9 flex items-center justify-center"
                    onClick={() => setCollectionUID(student.uid)}
                  >
                    <HiCurrencyRupee className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    color="failure"
                    className="rounded-full p-2 h-9 w-9 flex items-center justify-center"
                    onClick={() => {}}
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Table view for desktop */}
          <div className="overflow-x-auto w-full hidden md:block">
            <Table striped className="min-w-[600px]">
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
        </div>
      )}
    </div>
  );
}
