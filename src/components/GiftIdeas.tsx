"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { BudgetId } from "@/config/gift-ideas";

export type GiftIdeaLink = { name: string; why: string; href: string; storeLabel: string };
export type GiftBudget = { id: BudgetId; label: string; ideas: GiftIdeaLink[] };

export function GiftIdeas({ festivalName, budgets }: { festivalName: string; budgets: GiftBudget[] }) {
  const [budgetId, setBudgetId] = useState<BudgetId>(budgets[0].id);

  return (
    <div className="gift-ideas">
      <label className="gift-budget-picker">
        <span>Your budget</span>
        <select value={budgetId} onChange={(event) => setBudgetId(event.target.value as BudgetId)}>
          {budgets.map((budget) => <option key={budget.id} value={budget.id}>{budget.label}</option>)}
        </select>
      </label>
      {/* Every budget stays in the HTML so search engines can read all the ideas. */}
      {budgets.map((budget) => (
        <div
          className="gift-budget-list"
          hidden={budget.id !== budgetId}
          key={budget.id}
          aria-label={`${festivalName} gift ideas, ${budget.label}`}
          role="group"
        >
          {budget.ideas.map((idea) => (
            <article className="gift-card" key={idea.name}>
              <h4>{idea.name}</h4>
              <p>{idea.why}</p>
              <a href={idea.href} rel="sponsored noopener noreferrer" target="_blank">
                See options on {idea.storeLabel} <ArrowUpRight aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
