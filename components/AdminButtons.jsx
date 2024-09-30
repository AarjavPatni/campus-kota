import { Button } from "flowbite-react";

const AdminButtons = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6 mt-6 md:flex-row md:gap-y-0 md:gap-x-6">
      <Button href="/billingList" className="flex items-center justify-center gap-x-1 text-sm text-white font-medium custom-btn-bg border border-gray-500 active:bg-gray-900">
        Billing
      </Button>
      <Button href="/studentList" className="flex items-center justify-center gap-x-1 text-sm text-white font-medium custom-btn-bg border border-gray-500 active:bg-gray-900">
        Student List
      </Button>
      <Button href="/insert" className="flex items-center justify-center gap-x-1 text-sm text-white font-medium custom-btn-bg border border-gray-500 active:bg-gray-900">
        New Student Details
      </Button>
    </div>
  );
};

export default AdminButtons;
