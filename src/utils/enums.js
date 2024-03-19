// Define Enums of Response type
const responseType = {
  0: "Created Successfully!",
  1: "Updated Successfully!",
  2: "Deleted Successfully!",
  3: "Empty request body",
  4: "Invalid data",
  5: "Mail send successfully!",
  6: "Fetch Successfully!",
  7: "Login Successfully!",
  8: "User not found",
  9: "Unsupported file type",
};
Object.freeze(responseType);

const moduleNames = {
  0: "User",
  1: "profile",
  2: "Employee",
};
Object.freeze(moduleNames);

export { responseType, moduleNames };
