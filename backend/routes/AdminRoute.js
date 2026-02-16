const express = require("express");
const router = express.Router();
const multer = require("multer");

const adminController = require("../controllers/AdminController");
const { adminAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const csvUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const { getAdminDashboardMetrics } = require("../controllers/AdminDashboardController");

router.get("/dashboard-metrics", adminAuth, getAdminDashboardMetrics);

router.post("/create", adminAuth, adminController.createAdmin);

// Login route
router.post("/login", adminController.loginAdmin);

// Password change route - authenticated admin only
router.put("/change-password", adminAuth, adminController.changePassword);


router.get("/get-students", adminAuth, adminController.getStudents);
router.put("/update-student/:id", adminAuth, adminController.updateStudent);
router.delete("/delete-student/:id", adminAuth, adminController.deleteStudent);
router.get("/me", adminAuth, adminController.getProfile);
router.put("/profile", adminAuth, adminController.updateProfile);
router.post("/upload-profile", adminAuth, upload.single('profilePic'), adminController.uploadProfilePic);
router.get("/paid-users", adminAuth, adminController.getPaidUsers);

// Admin student progress routes
router.get("/student/:studentId/course/:courseId/progress", adminAuth, adminController.getStudentCourseProgress);
router.put("/student/:studentId/course/:courseId/lesson", adminAuth, adminController.updateStudentLessonProgress);

// New payment and course management routes
router.get("/students-with-purchases", adminAuth, adminController.getStudentsWithPurchases);
router.get("/payments", adminAuth, adminController.getAllPayments);
router.get("/course-statistics", adminAuth, adminController.getCourseStatistics);
router.put("/student/:studentId/course/:courseId/status", adminAuth, adminController.updateStudentCourseStatus);
router.get("/receipt/:receiptId/download", adminAuth, adminController.downloadStudentReceipt);

// Super Admin: User Management & Enrollment
router.post("/create-user", adminAuth, adminController.adminCreateUser);
router.get("/all-users-list", adminAuth, adminController.adminGetAllUsers);
router.get("/all-courses-list", adminAuth, adminController.adminGetAllCourses);
router.post("/enroll-user", adminAuth, adminController.adminEnrollUser);
router.post("/remove-enrollment", adminAuth, adminController.adminRemoveEnrollment);
router.get("/user-detail/:userId", adminAuth, adminController.adminGetUserDetail);
router.put("/update-user/:userId", adminAuth, adminController.adminUpdateUser);
router.delete("/delete-user/:userId", adminAuth, adminController.adminDeleteUser);
router.post("/ban-user/:userId", adminAuth, adminController.adminBanUser);
router.post("/unban-user/:userId", adminAuth, adminController.adminUnbanUser);
router.get("/pending-registrations", adminAuth, adminController.adminGetPendingRegistrations);
router.get("/all-payments", adminAuth, adminController.adminGetPayments);
router.put("/approve-payment/:paymentId", adminAuth, adminController.adminApprovePayment);
router.put("/reject-payment/:paymentId", adminAuth, adminController.adminRejectPayment);
router.post("/bulk-upload-users", adminAuth, csvUpload.single("file"), adminController.adminBulkUploadUsers);

// Offline payment management
router.get("/offline-payments", adminAuth, adminController.listOfflinePayments);
router.put("/payment/:paymentId/offline/approve", adminAuth, adminController.approveOfflinePayment);
router.put("/payment/:paymentId/offline/reject", adminAuth, adminController.rejectOfflinePayment);
router.post("/payment/manual", adminAuth, upload.single('slip'), adminController.manualUploadPayment);

module.exports = router;
