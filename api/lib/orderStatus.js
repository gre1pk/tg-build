const ALLOWED_TRANSITIONS = {
  new: ['in_progress', 'cancelled'],
  in_progress: ['done', 'cancelled'],
  done: [],
  cancelled: [],
};

const ORDER_STATUSES = ['new', 'in_progress', 'done', 'cancelled'];

function assertValidTransition(from, to) {
  const allowed = ALLOWED_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    throw new Error(`Invalid status transition: ${from} → ${to}`);
  }
}

module.exports = {
  assertValidTransition,
  ALLOWED_TRANSITIONS,
  ORDER_STATUSES,
};
