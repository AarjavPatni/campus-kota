import { Button } from "flowbite-react";
import LogoutButton from "./LogoutButton";

const AdminButtons = () => {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        {process.env.NODE_ENV === 'development' 
          ? 'Admin Portal - TEST' 
          : 'Admin Portal'}
      </h1>
      <div className="flex flex-col items-center justify-center gap-y-6 mt-6 md:flex-row md:gap-y-0 md:gap-x-6">
        <Button href="/insert" className="flex items-center justify-center gap-x-1 text-sm text-white font-medium custom-btn-bg border border-gray-500 active:bg-gray-900">
          New Student Details
        </Button>
        <Button href="/studentList" className="flex items-center justify-center gap-x-1 text-sm text-white font-medium custom-btn-bg border border-gray-500 active:bg-gray-900">
          Student List
        </Button>
        {/* !! Not for v1.0
        <Button href="/billingList" className="flex items-center justify-center gap-x-1 text-sm text-white font-medium custom-btn-bg border border-gray-500 active:bg-gray-900">
          Billing List
        </Button> 
        */}
        <Button href="/collectionList" className="flex items-center justify-center gap-x-1 text-sm text-white font-medium custom-btn-bg border border-gray-500 active:bg-gray-900">
          Collection List
        </Button>
      </div>
      <div className="mt-8 flex justify-center">
        <LogoutButton />
      </div>
    </div>
  );
};

export default AdminButtons;
