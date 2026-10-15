import { GripVertical, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { BSA_PARAMETER_MAPPING } from '@/features/mapping/BsaMapping';
import { GST_PARAMETER_MAPPING } from '@/features/mapping/GstMapping';
import { ITR_PARAMETER_MAPPING } from '@/features/mapping/ItrMapping';
import { ALL_CIBIL_PARAMETERS } from '@/features/mapping/cibilMapping';
import './BsaMappingFormulaBuilder.css';

type ArithmeticOperator = '+' | '-' | '*' | '/' | '%' | 'END' | 'NA';
type Comparator = '>' | '>=' | '<' | '<=' | '=' | '!=';
type Service = 'BSA' | 'GST' | 'ITR' | 'CIBIL';

interface BsaParameter {
  id: string;
  service: Service;
  group: string;
  key: string;
  label: string;
  path: string;
}

interface FormulaTerm extends BsaParameter {
  termId: number;
  operator: ArithmeticOperator;
}

const services: Service[] = ['BSA', 'GST', 'ITR', 'CIBIL'];
const formatLabel = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/^./, (character) => character.toUpperCase());

function flattenMapping(service: Service, mapping: object): BsaParameter[] {
  return Object.entries(mapping).flatMap(([group, entries]) =>
    Object.entries(entries as Record<string, string>).map(([key, path]) => ({
      id: `${service}.${group}.${key}`,
      service,
      group,
      key,
      label: formatLabel(key),
      path,
    }))
  );
}

const mappingParameters: Record<Service, BsaParameter[]> = {
  BSA: flattenMapping('BSA', BSA_PARAMETER_MAPPING),
  GST: flattenMapping('GST', GST_PARAMETER_MAPPING),
  ITR: flattenMapping('ITR', ITR_PARAMETER_MAPPING),
  CIBIL: ALL_CIBIL_PARAMETERS.map((parameter) => ({
    ...parameter,
    id: `CIBIL.${parameter.id}`,
    service: 'CIBIL' as const,
  })),
};

function operatorSymbol(operator: ArithmeticOperator): string {
  if (operator === '*') return '×';
  if (operator === '/') return '÷';
  if (operator === '-') return '−';
  return operator;
}

export function BsaMappingFormulaBuilder() {
  const [selectedService, setSelectedService] = useState<Service>('BSA');
  const [search, setSearch] = useState('');
  const [terms, setTerms] = useState<FormulaTerm[]>([]);
  const [comparator, setComparator] = useState<Comparator>('>');
  const [comparisonValue, setComparisonValue] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [validationError, setValidationError] = useState(false);
  const nextTermId = useRef(0);

  const serviceParameters = mappingParameters[selectedService];
  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    const groups = new Map<string, BsaParameter[]>();

    serviceParameters
      .filter((parameter) =>
        `${parameter.group} ${parameter.label} ${parameter.path}`
          .toLowerCase()
          .includes(query)
      )
      .forEach((parameter) => {
        const parameters = groups.get(parameter.group) ?? [];
        parameters.push(parameter);
        groups.set(parameter.group, parameters);
      });

    return Array.from(groups, ([group, parameters]) => ({
      group,
      title: formatLabel(group.replace(/[._]/g, ' ')),
      parameters,
    }));
  }, [search, serviceParameters]);

  const addParameter = (parameter: BsaParameter) => {
    if (terms.some((term) => term.id === parameter.id)) {
      setValidationError(true);
      setValidationMessage(`${parameter.label} is already in the formula.`);
      return;
    }

    setValidationMessage('');
    setValidationError(false);
    setTerms((current) => [
      ...current,
      {
        ...parameter,
        termId: nextTermId.current++,
        operator: 'NA' as ArithmeticOperator,
      },
    ]);
  };
  useEffect(() => {
  console.log("Current terms:", terms);
}, [terms]);
  const handleParameterDrop = (event: DragEvent<HTMLElement>) => {
    console.log('handleParameterDrop', terms);
    event.preventDefault();
    event.stopPropagation();
    const parameterId = event.dataTransfer.getData('text/bsa-parameter-id');
    const parameter = services
      .flatMap((service) => mappingParameters[service])
      .find((item) => item.id === parameterId);
    if (!parameter) {
      setValidationError(true);
      setValidationMessage(
        'That item is not a mapped parameter. Drag a parameter from the list.'
      );
      return;
    }
    addParameter(parameter);
  };

  const handleOperatorDrop = (
    event: DragEvent<HTMLElement>,
    termId: number
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const operator = event.dataTransfer.getData('text/bsa-arithmetic-operator');
    if (
      operator === '+' ||
      operator === '-' ||
      operator === '*' ||
      operator === '/' ||
      operator === '%' ||
      operator === 'END' 
    ) {
      setValidationError(false);
      setValidationMessage('');
      setTerms((current) =>
        current.map((term) =>
          term.termId === termId ? { ...term, operator } : term
        )
      );
    } else {
      setValidationError(true);
      setValidationMessage(
        'Drop an arithmetic operator (+, −, ×, ÷, %, or END) into an operator slot.'
      );
    }
  };

  const validateFormula = () => {
    if (terms.length === 0) {
      setValidationError(true);
      setValidationMessage('Add at least one mapped parameter to the formula.');
      return;
    }
    if (
      terms.some(
        (term) =>
          !term.path.trim() ||
          !mappingParameters[term.service].some(
            (parameter) => parameter.id === term.id && parameter.path === term.path
          )
      )
    ) {
      setValidationError(true);
      setValidationMessage(
        'One or more selected parameters do not have a mapped report path.'
      );
      return;
    }
    if (!comparisonValue.trim() || !Number.isFinite(Number(comparisonValue))) {
      setValidationError(true);
      setValidationMessage('Enter a valid numeric comparison value.');
      return;
    }

    setValidationError(false);
    setValidationMessage('Formula is valid.');
  };

  const parameter_list = terms.map((term) => term.path);
  const formula = terms.length
    ? `${terms[0].path}${terms
        .slice(1)
        .map((term) => ` ${operatorSymbol(term.operator)} ${term.path}`)
        .join('')} ${comparator} ${comparisonValue || '[value]'}`
    : `Drag ${selectedService} parameters here to build a formula`;

  return (
    <section className="bsa-mapping-builder" aria-labelledby="bsa-mapping-title">
      <div className="bsa-mapping-heading">
        <div>
          <p className="loan-eyebrow">Eligibility configuration</p>
          <h2 id="bsa-mapping-title">{selectedService} parameters</h2>
          <p>
            Select a service, then drag its mapped parameters into the formula.
          </p>
        </div>
        <span>{serviceParameters.length} mapped parameters</span>
      </div>

      <nav className="bsa-service-tabs" aria-label="Select parameter service">
        {services.map((service) => (
          <button
            aria-pressed={selectedService === service}
            className={`bsa-service-tab${selectedService === service ? ' is-active' : ''}`}
            key={service}
            onClick={() => {
              setSelectedService(service);
              setSearch('');
              setValidationMessage('');
              setValidationError(false);
            }}
            type="button"
          >
            {service}
            <span>{mappingParameters[service].length}</span>
          </button>
        ))}
      </nav>

      <div className="bsa-mapping-layout">
        <div className="bsa-mapping-list">
          <label className="bsa-mapping-search">
            <Search size={16} aria-hidden="true" />
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search parameters or paths"
              type="search"
              value={search}
            />
          </label>
          <div className="bsa-mapping-groups" key={selectedService}>
            {filteredGroups.map((group) => (
              <section className="bsa-mapping-group" key={group.group}>
                <h3>{group.title}</h3>
                {group.parameters.map((parameter) => (
                  <button
                    className="bsa-mapping-parameter"
                    draggable
                    key={parameter.id}
                    onClick={() => {
                      console.log('Parameter selected:', {
                        service: parameter.service,
                        name: parameter.label,
                        path: parameter.path,
                      });
                      addParameter(parameter);
                    }}
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        'text/bsa-parameter-id',
                        parameter.id
                      );
                      event.dataTransfer.effectAllowed = 'copy';
                    }}
                    title={`Drag ${parameter.label} to the formula`}
                    type="button"
                  >
                    <GripVertical size={15} aria-hidden="true" />
                    <span>
                      <strong>{parameter.label}</strong>
                      {/* <code>{parameter.path}</code> */}
                    </span>
                    <Plus size={15} aria-hidden="true" />
                  </button>
                ))}
              </section>
            ))}
            {filteredGroups.length === 0 && (
              <p className="bsa-mapping-empty">No matching BSA mappings.</p>
            )}
          </div>
        </div>

        <section
          aria-label="BSA formula drop area"
          className="bsa-formula-editor"
          data-parameter-list={JSON.stringify(parameter_list)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleParameterDrop}
        >
          <div
            className="bsa-operator-toolbar"
            aria-label="Drag-only arithmetic operators"
          >
            <span>Operators</span>
            {([
              ['+', '+'],
              ['-', '−'],
              ['*', '×'],
              ['/', '÷'],
              ['%', '%'],
              ['END', 'END'],
            ] as const).map(([operator, label]) => (
              <span
                aria-label={`Drag ${label} operator`}
                className="bsa-operator-item"
                draggable
                key={operator}
                onDragStart={(event) => {
                  event.dataTransfer.setData(
                    'text/bsa-arithmetic-operator',
                    operator
                  );
                  event.dataTransfer.effectAllowed = 'copy';
                }}
                title={`Drag ${label} to an operator slot`}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="bsa-formula-terms">
            {terms.map((term, index) => (
              <div className="bsa-formula-term-wrap" key={term.termId}>
                {index > 0 && (
                  <div
                    aria-label={`Operator before ${term.label}; drop an operator to change`}
                    className="bsa-operator-slot"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleOperatorDrop(event, term.termId)}
                    role="group"
                  >
                    {operatorSymbol(term.operator)}
                  </div>
                )}
                <article className="bsa-formula-term">
                  <span>
                    <strong>{term.label}</strong>
                    <code>{term.path}</code>
                  </span>
                  <button
                    aria-label={`Remove ${term.label}`}
                    onClick={() => {
                      setTerms((current) =>
                        current.filter((item) => item.termId !== term.termId)
                      );
                      setValidationMessage('');
                      setValidationError(false);
                    }}
                    type="button"
                  >
                    <X size={15} />
                  </button>
                </article>
              </div>
            ))}
            <div
              className="bsa-formula-dropzone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleParameterDrop}
            >
              <Plus size={16} aria-hidden="true" />
              Drop another {selectedService} parameter here, or click one from the list
            </div>
          </div>

          <label className="bsa-comparator">
            <span>Comparison</span>
            <select
              aria-label="BSA formula comparison operator"
              onChange={(event) => {
                setComparator(event.target.value as Comparator);
                setValidationMessage('');
                setValidationError(false);
              }}
              value={comparator}
            >
              <option value=">">&gt;</option>
              <option value=">=">&gt;=</option>
              <option value="<">&lt;</option>
              <option value="<=">&lt;=</option>
              <option value="=">=</option>
              <option value="!=">!=</option>
            </select>
            <input
              aria-label="Comparison value"
              onChange={(event) => {
                setComparisonValue(event.target.value);
                setValidationMessage('');
                setValidationError(false);
              }}
              placeholder="Value"
              value={comparisonValue}
            />
          </label>

          <div className="bsa-formula-preview" aria-live="polite">
            <span>{selectedService} formula path</span>
            <code>{formula}</code>
          </div>
          <div className="bsa-formula-validation-row">
            <button
              className="bsa-validate-button"
              onClick={validateFormula}
              type="button"
            >
              Validate formula
            </button>
            {validationMessage && (
              <p
                className={
                  validationError
                    ? 'bsa-validation-error'
                    : 'bsa-validation-success'
                }
                role={validationError ? 'alert' : 'status'}
              >
                {validationMessage}
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
