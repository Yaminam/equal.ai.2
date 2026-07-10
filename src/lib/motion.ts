// One easing curve and one spring across the whole page, so every movement
// feels like it comes from the same hand.
export const EASE = [0.16, 1, 0.3, 1] as const;

export const SPRING = { type: "spring", stiffness: 260, damping: 30, mass: 0.6 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 140, damping: 24 } as const;

export const viewportOnce = { once: true, amount: 0.35 } as const;
