const express = require('express');
const { listCampaigns, createCampaign, donate, listDonations, topDonors } = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', listCampaigns);
router.post('/', createCampaign);
router.post('/:id/donate', donate);
router.get('/donations', listDonations);
router.get('/donors/top', topDonors);

module.exports = router;
