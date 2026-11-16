import { TokenType } from '@open-dcp/equation-editor';
import { formatNextOptions } from './useOptionFormatter';

describe('formatNextOptions', () => {
    it('returns an empty list when there are no options', () => {
        expect(formatNextOptions({})).toEqual([]);
    });

    it('adds a divider and variable options with description and data', () => {
        const result = formatNextOptions({
            variables: [{ label: 'Temperature', value: 'temp', description: 'Reactor temp', data: { unit: 'C' } }],
        });

        expect(result).toEqual([
            { id: 'divider_variables', label: 'Variables', value: 'divider_variables', type: 'divider' },
            {
                id: 'variable_temp_0',
                label: 'Temperature',
                value: 'temp',
                type: TokenType.Variable,
                subtitle: 'Reactor temp',
                data: { unit: 'C' },
            },
        ]);
    });

    it('hides descriptions when ignoreDescription is set', () => {
        const result = formatNextOptions(
            { variables: [{ label: 'A', value: 'a', description: 'desc' }] },
            { ignoreDescription: { variables: true } },
        );

        expect(result[1]).not.toHaveProperty('subtitle');
    });

    it('maps string operators to math symbols and objects to operators', () => {
        const result = formatNextOptions({
            operators: ['+', { label: 'and', value: '&&', description: 'Logical and' } as any],
        });

        expect(result.slice(1)).toEqual([
            { id: 'math_symbol_+_0', label: '+', value: '+', type: TokenType.MathSymbol },
            { id: 'operator_&&_1', label: 'and', value: '&&', type: TokenType.Operator, subtitle: 'Logical and' },
        ]);
    });

    it('excludes argument separators from brackets', () => {
        const result = formatNextOptions({ brackets: ['[', ']', ','], argumentSeparators: [','] });

        expect(result.map(o => o.id)).toEqual([
            'divider_brackets',
            'bracket_[_0',
            'bracket_]_1',
            'divider_argument_separators',
            'argument_separator_,_0',
        ]);
        expect(result[1].type).toBe(TokenType.LeftBracket);
        expect(result[2].type).toBe(TokenType.RightBracket);
    });

    it('adds function metadata from functionMetadataByLabel', () => {
        const result = formatNextOptions(
            { parentheses: ['('], functions: ['sum'] },
            { functionMetadataByLabel: { sum: { description: 'Sum values', data: { arity: 2 } } } },
        );

        expect(result).toEqual([
            { id: 'divider_parentheses', label: 'Parentheses', value: 'divider_parentheses', type: 'divider' },
            { id: 'parenthesis_(_0', label: '(', value: '(', type: TokenType.Parenthesis },
            { id: 'divider_functions', label: 'Functions', value: 'divider_functions', type: 'divider' },
            {
                id: 'function_sum_0',
                label: 'sum',
                value: 'sum',
                type: TokenType.Function,
                subtitle: 'Sum values',
                data: { arity: 2 },
            },
        ]);
    });
});
