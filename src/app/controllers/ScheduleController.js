const { Appointment, User } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class ScheduleController {
  async create (req, res) {
    console.log(moment().format())
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.session.user.id,
        date: {
          [Op.gt]: moment().format()
        }
      },
      include: {
        model: User,
        as: 'employee',
        attributes: ['name', 'avatar']
      }
    })

    const tasks = appointments.map(appointment => {
      const { id, user_id, date } = appointment
      const { name, avatar } = appointment.employee
      return {
        id,
        date: moment(date).format('L HH:mm'),
        future: moment(date).isAfter(moment()),
        user: { id: user_id, name, avatar }
      }
    })

    return res.render('customer/schedules', { tasks })
  }
}

module.exports = new ScheduleController()
