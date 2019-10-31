import React from 'react';

import { Label, SubLabel } from './Label';
import { AgendaCard, TodoCard, StatisticsCard } from './OverviewCard';

const AgendaOverview = props => {
    const {
        currAgendas,
        doneAgendas,
        todos,
        doneTodos,
        handleNavigateToAgenda,
        handleNavigateToTodo,
        handleToggleTodo
    } = props;
    return (
        <div className="agendaOverview-container">
            <SubLabel title="Agenda Overview" />
            <Label title="안건 현황" />

            <div className="agendaOverview-cards">
                <AgendaCard
                    type="curr"
                    agendas={currAgendas}
                    handleNavigateToAgenda={handleNavigateToAgenda}
                    handleNavigateToTodo={handleNavigateToTodo}
                />
                <TodoCard
                    todos={todos}
                    handleNavigateToAgenda={handleNavigateToAgenda}
                    handleNavigateToTodo={handleNavigateToTodo}
                    handleToggleTodo={handleToggleTodo}
                />
            </div>
            <div className="agendaOverview-cards">
                <AgendaCard
                    type="done"
                    agendas={doneAgendas}
                    handleNavigateToAgenda={handleNavigateToAgenda}
                    handleNavigateToTodo={handleNavigateToTodo}
                />
                <div className="statistics-container">
                    <StatisticsCard
                        type="agenda"
                        currAgendas={currAgendas}
                        doneAgendas={doneAgendas}
                        todos={todos}
                        doneToddo={doneTodos}
                    />
                    <StatisticsCard
                        type="todo"
                        currAgendas={currAgendas}
                        doneAgendas={doneAgendas}
                        todos={todos}
                        doneTodos={doneTodos}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgendaOverview;
