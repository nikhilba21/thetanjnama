export interface PollQuestion {
  id: string;
  question: string;
  options: string[];
  active: boolean;
  created_at: string;
}

export interface PollResponse {
  id: string;
  poll_id: string;
  user_name: string;
  city_district: string;
  selected_option: string;
  user_opinion: string;
  solution_idea: string;
  publish_consent: string;
  mobile_number: string;
  submitted_at: string;
}

let currentPoll: PollQuestion = {
  id: 'poll-1',
  question: '"स्कूल ठीक करो" आंदोलन को आप कितना महत्वपूर्ण मानते हैं?',
  options: ['बहुत महत्वपूर्ण', 'महत्वपूर्ण', 'कम महत्वपूर्ण', 'महत्वपूर्ण नहीं'],
  active: true,
  created_at: new Date().toISOString()
};

let pollResponses: PollResponse[] = [
  {
    id: 'resp-1',
    poll_id: 'poll-1',
    user_name: 'रमेश शर्मा',
    city_district: 'जयपुर, राजस्थान',
    selected_option: 'बहुत महत्वपूर्ण',
    user_opinion: 'सरकारी स्कूलों में मूलभूत सुविधाओं और गुणवत्तापूर्ण शिक्षा का होना अति आवश्यक है।',
    solution_idea: 'प्रत्येक स्कूल में नियमित निरीक्षण और शिक्षकों की समयबद्ध उपस्थिति सुनिश्चित की जाए।',
    publish_consent: 'हाँ, मेरे नाम के साथ प्रकाशित की जा सकती है।',
    mobile_number: '98290XXXXX',
    submitted_at: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

export function getActivePoll(): { poll: PollQuestion | null; results: Record<string, number>; totalVotes: number } {
  if (!currentPoll || !currentPoll.active) {
    return { poll: null, results: {}, totalVotes: 0 };
  }

  const results: Record<string, number> = {};
  currentPoll.options.forEach((opt) => {
    results[opt] = 0;
  });

  let totalVotes = 0;
  pollResponses
    .filter((r) => r.poll_id === currentPoll.id)
    .forEach((r) => {
      totalVotes++;
      if (results[r.selected_option] !== undefined) {
        results[r.selected_option]++;
      } else {
        results[r.selected_option] = 1;
      }
    });

  return {
    poll: currentPoll,
    results,
    totalVotes
  };
}

export function updatePollQuestion(question: string, options: string[], active = true): PollQuestion {
  currentPoll = {
    id: `poll-${Date.now()}`,
    question: question.trim(),
    options: options.map((o) => o.trim()).filter(Boolean),
    active,
    created_at: new Date().toISOString()
  };
  return currentPoll;
}

export function togglePollActive(active?: boolean): boolean {
  if (typeof active === 'boolean') {
    currentPoll.active = active;
  } else {
    currentPoll.active = !currentPoll.active;
  }
  return currentPoll.active;
}

export function submitPollResponse(data: {
  poll_id: string;
  user_name: string;
  city_district: string;
  selected_option: string;
  user_opinion: string;
  solution_idea?: string;
  publish_consent: string;
  mobile_number?: string;
}): PollResponse {
  const newResp: PollResponse = {
    id: `resp-${Date.now()}`,
    poll_id: data.poll_id,
    user_name: data.user_name.trim(),
    city_district: data.city_district.trim(),
    selected_option: data.selected_option.trim(),
    user_opinion: data.user_opinion.trim(),
    solution_idea: data.solution_idea?.trim() || 'N/A',
    publish_consent: data.publish_consent.trim(),
    mobile_number: data.mobile_number?.trim() || 'N/A',
    submitted_at: new Date().toISOString()
  };

  pollResponses.unshift(newResp);
  return newResp;
}

export function getAllPollResponses(): PollResponse[] {
  return pollResponses;
}

export function deletePollResponse(id: string): boolean {
  const prev = pollResponses.length;
  pollResponses = pollResponses.filter((r) => r.id !== id);
  return pollResponses.length < prev;
}
