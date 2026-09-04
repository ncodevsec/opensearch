import { Icon } from "./Icon";

export function TodoCard({
	todos,
	todoInput,
	setTodoInput,
	addTodo,
	toggleTodo,
	removeTodo,
}) {
	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
			<h3 className="text-lg font-semibold text-slate-900">Todo</h3>
			<form
				onSubmit={addTodo}
				className="mt-4 grid grid-cols-[1fr_auto] gap-3"
			>
				<input
					value={todoInput}
					onChange={(event) => setTodoInput(event.target.value)}
					placeholder="Add a task"
					className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
				/>
				<button
					type="submit"
					className="rounded-full border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
				>
					<Icon name="fa-plus" className="text-base" />
				</button>
			</form>

			{todos.length === 0 ? (
				<p className="mt-4 text-sm text-slate-500">
					No tasks yet. Add something important.
				</p>
			) : (
				<ul className="mt-4 space-y-3">
					{todos.map((todo) => (
						<li
							key={todo.id}
							className="flex items-center justify-between gap-3 rounded-full border border-slate-200"
						>
							<button
								type="button"
								className="flex flex-1 items-center gap-3 p-2 text-left"
								onClick={() => toggleTodo(todo.id)}
							>
								<span
									className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${todo.completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-400 text-slate-400"}`}
								>
									{todo.completed ? "✓" : ""}
								</span>
								<span
									className={
										todo.completed
											? "text-sm text-slate-400 line-through opacity-70"
											: "text-sm text-slate-700"
									}
								>
									{todo.text}
								</span>
							</button>
							<button
								type="button"
								className="rounded-full p-2 text-xs text-red-500/50 transition hover:bg-slate-200 hover:text-red-500"
								onClick={() => removeTodo(todo.id)}
							>
								<Icon name="fa-xmark" className="text-sm" />
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
