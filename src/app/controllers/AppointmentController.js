const { User, Appointment } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)

    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })

    return res.redirect('/app/dashboard')
  }

  async show (req, res) {
    const date = moment(parseInt(req.body.date))
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      },
      include: {
        model: User,
        as: 'customer',
        attributes: ['name', 'avatar']
      }
    })

    const tasks = appointments.map(appointment => {
      const { id, user_id, date } = appointment
      const { name, avatar } = appointment.customer
      return {
        id,
        date: moment(date).format('HH:mm'),
        future: moment(date).isAfter(moment()),
        user: { id: user_id, name, avatar }
      }
    })

    return res.render('employee/schedules', { tasks })
  }
}

module.exports = new AppointmentController()
