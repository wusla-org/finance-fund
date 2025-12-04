-- Seed Data for Finance Tracker
-- Run this in Supabase SQL Editor

-- Insert Departments
INSERT INTO "Department" (id, name, "createdAt", "updatedAt")
VALUES
  ('dept1', 'Computer Science', NOW(), NOW()),
  ('dept2', 'Mechanical Engineering', NOW(), NOW()),
  ('dept3', 'Civil Engineering', NOW(), NOW()),
  ('dept4', 'Electronics', NOW(), NOW()),
  ('dept5', 'Business Administration', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert Students for Computer Science
INSERT INTO "Student" (id, name, "departmentId", "amountPaid", target, status, "createdAt", "updatedAt")
VALUES
  ('std1', 'Rahul Kumar', 'dept1', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std2', 'Priya Sharma', 'dept1', 2500, 5000, 'PARTIAL', NOW(), NOW()),
  ('std3', 'Amit Patel', 'dept1', 0, 5000, 'PENDING', NOW(), NOW()),
  ('std4', 'Sneha Reddy', 'dept1', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std5', 'Vikram Singh', 'dept1', 2500, 5000, 'PARTIAL', NOW(), NOW());

-- Insert Students for Mechanical Engineering
INSERT INTO "Student" (id, name, "departmentId", "amountPaid", target, status, "createdAt", "updatedAt")
VALUES
  ('std6', 'Arjun Mehta', 'dept2', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std7', 'Kavya Nair', 'dept2', 0, 5000, 'PENDING', NOW(), NOW()),
  ('std8', 'Rohan Verma', 'dept2', 2500, 5000, 'PARTIAL', NOW(), NOW()),
  ('std9', 'Anjali Gupta', 'dept2', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std10', 'Karthik Reddy', 'dept2', 0, 5000, 'PENDING', NOW(), NOW());

-- Insert Students for Civil Engineering
INSERT INTO "Student" (id, name, "departmentId", "amountPaid", target, status, "createdAt", "updatedAt")
VALUES
  ('std11', 'Divya Iyer', 'dept3', 2500, 5000, 'PARTIAL', NOW(), NOW()),
  ('std12', 'Arun Kumar', 'dept3', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std13', 'Pooja Desai', 'dept3', 0, 5000, 'PENDING', NOW(), NOW()),
  ('std14', 'Nikhil Joshi', 'dept3', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std15', 'Megha Pillai', 'dept3', 2500, 5000, 'PARTIAL', NOW(), NOW());

-- Insert Students for Electronics
INSERT INTO "Student" (id, name, "departmentId", "amountPaid", target, status, "createdAt", "updatedAt")
VALUES
  ('std16', 'Suresh Babu', 'dept4', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std17', 'Lakshmi Menon', 'dept4', 0, 5000, 'PENDING', NOW(), NOW()),
  ('std18', 'Ravi Shankar', 'dept4', 2500, 5000, 'PARTIAL', NOW(), NOW()),
  ('std19', 'Deepika Rao', 'dept4', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std20', 'Harish Kumar', 'dept4', 0, 5000, 'PENDING', NOW(), NOW());

-- Insert Students for Business Administration
INSERT INTO "Student" (id, name, "departmentId", "amountPaid", target, status, "createdAt", "updatedAt")
VALUES
  ('std21', 'Sanjay Tripathi', 'dept5', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std22', 'Nisha Agarwal', 'dept5', 2500, 5000, 'PARTIAL', NOW(), NOW()),
  ('std23', 'Manoj Yadav', 'dept5', 0, 5000, 'PENDING', NOW(), NOW()),
  ('std24', 'Priyanka Sinha', 'dept5', 5000, 5000, 'COMPLETED', NOW(), NOW()),
  ('std25', 'Vijay Malhotra', 'dept5', 2500, 5000, 'PARTIAL', NOW(), NOW());
