import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        name: search,
        email: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const foundTask = database.findById('tasks', id)

      if (!foundTask) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
      }

      return res.end(JSON.stringify(foundTask))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const foundTask = database.findById('tasks', id)

      if (!foundTask) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
      }

      database.update('tasks', id, {
        ...foundTask,
        title,
        description,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const foundTask = database.findById('tasks', id)

      if (!foundTask) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
      }

      database.update('tasks', id, {
        ...foundTask,
        completed_at: foundTask.completed_at ? null : new Date(),
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const foundTask = database.findById('tasks', id)

      if (!foundTask) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  }
]