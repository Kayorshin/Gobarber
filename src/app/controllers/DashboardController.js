const { User } = require('../models')

class DashboardController {
  async index (req, res) {
    if (req.session.user.provider) {
      return res.render('employee/dashboard')
    }

    const providers = await User.findAll({
      where: { provider: true },
      attributes: { exclude: ['password_hash'] }
    })

    return res.render('customer/dashboard', { providers })
  }
}

module.exports = new DashboardController()
