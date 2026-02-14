const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, NotificationController.getMyNotifications);
router.get('/unread-count', authMiddleware, NotificationController.getUnreadCount);
router.put('/:id/read', authMiddleware, NotificationController.markAsRead);
router.put('/mark-all-read', authMiddleware, NotificationController.markAllAsRead);
router.delete('/:id', authMiddleware, NotificationController.deleteNotification);

module.exports = router;
