import {Color} from "./color";

export interface CreateMove {
    color: Color;
    move_number: number;
    from_position: string;
    to_position: string;
}
