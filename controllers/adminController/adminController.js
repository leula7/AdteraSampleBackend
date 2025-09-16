import { where } from 'sequelize';
import { Favorite, Job, MyJob, Rate, Report } from '../../models/index.js';

import { Op } from "sequelize";

export const getAllAdminJobs = async (req, res) => {
  try {
    const { status, category, limit, page, startDate, endDate } = req.query.filters || {};
    const { user_type } = req.user;
    const totalJobs = await Job.count();
    // Check authorization early
    if (user_type !== "admin") {
      return res.status(401).json({ message: "Unauthorized user type" });
    }

    // Build base query options
    const queryOptions = {
      where: {},
      limit: Number(limit) || 10,
      offset: ((Number(page) || 1) - 1) * (Number(limit) || 10)
    };

    // Status filter
    if (status && status !== "all") {
      queryOptions.where.status = status;
    }

    // Category filter
    if (category && category !== "all") {
      queryOptions.where.job_created_date = category || 1;
    }

    // Date range filter
    if (startDate && endDate) {
      queryOptions.where.job_created_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Execute query
    const adminJobs = await Job.findAll(queryOptions);
    res.status(200).json({
      totalJobs,
      totalPages: Math.ceil(totalJobs / queryOptions.limit),
      jobs: adminJobs
    });
  } catch (error) {
    console.error("Error in getAllAdminJobs:", error);
    res.status(500).json({ error: error.message });
  }
};


export const updateJobStatus = async (req, res) => {
  try {
    const result = await updateConnects(req.user.token, {
      jobId: req.params.id,
      status: req.body.status
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await apiGetUsers(req.user.token, req.query.type, req.query.limit, req.query.offset);
    res.json(users.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const result = await apiUpdateUserStatus(req.user.token, {
      userId: req.params.id,
      status: req.body.status
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await apiGetStats(req.user.token);
    res.json(stats.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getreports = async (req, res) => {
  try {
    const stats = await apiGetStats(req.user.token);
    res.json(stats.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Add other controller methods as needed