export const useAuthorize = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Unauthorized</h1>
        <p className="text-gray-700">
          You do not have permission to access this page.
        </p>
        <p className="mt-4 text-gray-500">
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
};
