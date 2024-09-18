import { BillGenerator } from "@/components/BillGenerator";
import { StudentList } from "@/components/StudentList";

export default function Home() {
  return (
    <div>
      <BillGenerator />
      <StudentList />
    </div>
  );
}
