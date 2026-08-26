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
  user_contact: string;
  selected_option: string;
  user_opinion: string;
  submitted_at: string;
}

let currentPoll: PollQuestion = {
  id: 'poll-1',
  question: 'क्या आपको लगता है कि आगामी चुनावों में युवाओं के रोजगार का मुद्दा सबसे महत्वपूर्ण रहेगा?',
  options: ['हाँ, बिल्कुल', 'नहीं, अन्य मुद्दे ज्यादा प्रभावी होंगे', 'कह नहीं सकते / तटस्थ'],
  active: true,
  created_at: new Date().toISOString()
};

let pollResponses: PollResponse[] = [
  {
    id: 'resp-1',
    poll_id: 'poll-1',
    user_name: 'रमेश कुमार',
    user_contact: 'ramesh@example.com',
    selected_option: 'हाँ, बिल्कुल',
    user_opinion: 'रोजगार ही मुख्य मुद्दा होना चाहिए।',
    submitted_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'resp-2',
    poll_id: 'poll-1',
    user_name: 'सुनील शर्मा',
    user_contact: '9876543210',
    selected_option: 'हाँ, बिल्कुल',
    user_opinion: 'युवा वर्ग अब परिणाम चाहता है।',
    submitted_at: new Date(Date.now() - 3600000 * 2).toISOString()
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

export function submitPollResponse(
  poll_id: string,
  selected_option: string,
  user_name?: string,
  user_contact?: string,
  user_opinion?: string
): PollResponse {
  const newResp: PollResponse = {
    id: `resp-${Date.now()}`,
    poll_id,
    user_name: user_name?.trim() || 'गुमनाम पाठक',
    user_contact: user_contact?.trim() || 'N/A',
    selected_option: selected_option.trim(),
    user_opinion: user_opinion?.trim() || '',
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
