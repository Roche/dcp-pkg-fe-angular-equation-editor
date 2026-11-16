import { TokenType } from '@open-dcp/equation-editor';
import { mapTokensForFormula } from './useTokenMapper';

describe('mapTokensForFormula', () => {
    it('uses label for variables and value for other tokens', () => {
        const result = mapTokensForFormula([
            { type: TokenType.Variable, label: 'Temperature', value: 'temp' },
            { type: TokenType.Operator, label: 'plus', value: '+' },
        ]);

        expect(result).toEqual([
            { type: TokenType.Variable, value: 'Temperature' },
            { type: TokenType.Operator, value: '+' },
        ]);
    });

    it('unwraps raw tokens and preserves data', () => {
        const data = { unit: 'C' };
        const result = mapTokensForFormula([{ raw: { type: TokenType.Variable, value: 'temp', data } }]);

        expect(result).toEqual([{ type: TokenType.Variable, value: 'temp', data }]);
    });

    it('appends an opening parenthesis after a trailing function', () => {
        const result = mapTokensForFormula([{ type: TokenType.Function, value: 'sum' }]);

        expect(result).toEqual([
            { type: TokenType.Function, value: 'sum' },
            { type: TokenType.Parenthesis, value: '(' },
        ]);
    });

    it('does not append a parenthesis when the function is not last', () => {
        const result = mapTokensForFormula([
            { type: TokenType.Function, value: 'sum' },
            { type: TokenType.Parenthesis, value: '(' },
        ]);

        expect(result).toHaveLength(2);
    });
});
