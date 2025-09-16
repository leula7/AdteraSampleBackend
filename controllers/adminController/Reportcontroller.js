// controllers/ReportController.js
import  sequelize from "../../config/db.js";    
import { Report } from "../../models/index.js";

const ReportController = {
  // Fetch reports with filters + pagination
  async getReports(req, res) {
    try {
      let { page = 1, limit = 10, startDate, endDate, status, type } = req.query;
      page = Number(page);
      limit = Number(limit);

      const where = {};

      if (status && status !== "all") {
        where.status = status;
      }
      if (type && type !== "all") {
        where.report_type = type;
      }
      if (startDate && endDate) {
        where.created_at = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      }

      const total = await Report.count({ where });
      const reports = await Report.findAll({
        where,
        order: [["created_at", "DESC"]],
        limit,
        offset: (page - 1) * limit,
      });

      res.json({
        data: reports,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Update report status
  async updateReport(req, res) {
    try {
      const { id } = req.params;
      const { status, description } = req.body;

      const report = await Report.findByPk(id);
      if (!report) return res.status(404).json({ message: "Report not found" });

      report.status = status;
      report.detail = description || report.detail;
      await report.save();

      res.json({ message: "Report updated successfully", report });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default ReportController;
