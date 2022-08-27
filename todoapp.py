from flask import Flask, render_template, request
import json
from json import JSONEncoder

app = Flask(__name__)


class Task:
    def __init__(self, item_id, task_description, email, priority):
        self.item_id = item_id
        self.task_description = task_description
        self.email = email
        self.priority = priority

    def reassign_id(self, item_id):
        self.item_id = item_id


class TaskEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


def load_tasks():
    with open('static/task.txt', 'r') as f_in:
        tasks_in = json.load(f_in)
    tasks = []
    for task in tasks_in:
        tasks.append(Task(task["item_id"], task["task_description"], task["email"], task["priority"]))
    return tasks


def update_tasks(tasks):
    with open('static/task.txt', 'w') as f_out:
        json.dump(tasks, f_out, indent=4, cls=TaskEncoder)


@app.route('/')
def main():
    tasks = load_tasks()
    return render_template("todoapp.html", tasks=tasks)


@app.route('/submit', methods=['POST'])
def submit():
    tasks = load_tasks()
    new_task_in = request.get_json()
    new_task = Task(len(tasks), new_task_in["task_description"], new_task_in["email"], new_task_in["priority"])
    tasks.append(new_task)
    update_tasks(tasks)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route('/clear', methods=['POST'])
def delete():
    id_to_del = request.get_json()["id_to_del"]
    tasks = load_tasks()
    del tasks[id_to_del]
    # update ids
    for i in range(id_to_del, len(tasks)):
        tasks[i].reassign_id(i)
    update_tasks(tasks)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


if __name__ == '__main__':
    app.run()
