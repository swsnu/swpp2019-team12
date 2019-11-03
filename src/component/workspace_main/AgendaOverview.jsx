import React from 'react';

import { Label, SubLabel } from './Label';
import { AgendaCard, TodoCard, StatisticsCard } from './OverviewCard';

const AgendaOverview = props => {
    const { currAgendas, doneAgendas, todos, doneTodos } = props;
    return (
        <div className="agendaOverview-container">
            <SubLabel title="Agenda Overview" />
            <Label title="안건 현황" />

            <div className="agendaOverview-cards">
                <AgendaCard type="curr" agendas={currAgendas} todos={todos} />
                <TodoCard todos={todos} />
            </div>
            <div className="agendaOverview-cards">
                <AgendaCard type="done" agendas={doneAgendas} todos={todos} />
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
