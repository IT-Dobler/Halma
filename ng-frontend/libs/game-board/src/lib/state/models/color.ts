export enum Color {
    YELLOW = 'Y',
    BLUE = 'B',
    RED = 'R',
    GREEN = 'G',
    NONE = 'NONE',
}

export const colorMap: Record<string, Color> = {
    'Y': Color.YELLOW,
    'B': Color.BLUE,
    'R': Color.RED,
    'G': Color.GREEN,
}

export const colorWheelInitialization = [
    Color.YELLOW,
    Color.RED,
    Color.BLUE,
    Color.GREEN,
];
