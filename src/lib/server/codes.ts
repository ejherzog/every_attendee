import { getAllEventCodes, getAllRsvpCodes } from "./read";

export async function validateEventCode(desiredCode: string): Promise<boolean> {
    const codes = await getAllEventCodes();
    return !codes.includes(desiredCode);
}

export async function generateEventCode(): Promise<string> {
    let code;
    const codes = await getAllEventCodes();
    do {
        code = generateString(6);
    } while (codes.includes(code));
    return code;
}

export async function generateRsvpCode(): Promise<string> {
    let code;
    const codes = await getAllRsvpCodes();
    do {
        code = generateString(4);
    } while (codes.includes(code));
    return code;
}

function generateString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}