import {
  ArrowUpDown,
  Check,
  ChevronDown,
  CircleHelp,
  GripVertical,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from 'react';
import {
  allGstParameters,
  gstParameterSections,
  type GstParameter,
} from '../config/gstEligibilityParameters';

type FormulaSide = 'left' | 'right';
type ArithmeticOperator = '+' | '-' | '*' | '/' | '%';
type Comparator = '>' | '>=' | '<' | '<=' | '=' | '!=';

interface FormulaTerm {
  id: string;
  kind: 'parameter' | 'value';
  label: string;
  parameterId?: string;
  value: string;
  operator: ArithmeticOperator;
}

interface Formula {
  id: string;
  left: FormulaTerm[];
  right: FormulaTerm[];
  comparator: Comparator;
}

const formulaKey = (bankCode: string) => `gst-eligibility-formulas:${bankCode}`;

function newTerm(
  parameter: GstParameter,
  operator: ArithmeticOperator = '+'
): FormulaTerm {
  return {
    id: `${Date.now()}-${Math.random()}`,
    kind: 'parameter',
    label: parameter.label,
    parameterId: parameter.id,
    value: '',
    operator,
  };
}

function newValueTerm(operator: ArithmeticOperator = '+'): FormulaTerm {
  return {
    id: `${Date.now()}-${Math.random()}`,
    kind: 'value',
    label: 'Value',
    value: '',
    operator,
  };
}

function makeDraft(
  parameter?: GstParameter,
  side: FormulaSide = 'left'
): Formula {
  return {
    id: `${Date.now()}-${Math.random()}`,
    left: parameter && side === 'left' ? [newTerm(parameter)] : [],
    right: parameter && side === 'right' ? [newTerm(parameter)] : [],
    comparator: '>',
  };
}

function readSavedFormulas(bankCode: string): Formula[] {
  try {
    const raw = sessionStorage.getItem(formulaKey(bankCode));
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (formula): formula is Formula =>
        !!formula &&
        typeof formula === 'object' &&
        typeof formula.id === 'string' &&
        Array.isArray(formula.left) &&
        Array.isArray(formula.right) &&
        typeof formula.comparator === 'string'
    );
  } catch (error) {
    console.warn('Unable to restore saved GST eligibility formulas.', error);
    return [];
  }
}

function formatSide(terms: FormulaTerm[]): string {
  return terms
    .map((term, index) => {
      const label =
        term.kind === 'value'
          ? term.value || 'Value'
          : term.label;
      const operator =
        term.operator === '*' ? '×' : term.operator === '/' ? '÷' : term.operator;
      return `${index === 0 ? '' : ` ${operator} `}${label}`;
    })
    .join('');
}

export function GstEligibilityBuilder({ bankCode }: { bankCode: string }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [search, setSearch] = useState('');
  const [activeSide, setActiveSide] = useState<FormulaSide>('left');
  const [parameterPickerSide, setParameterPickerSide] =
    useState<FormulaSide | null>(null);
  const [parameterSearch, setParameterSearch] = useState('');
  const [draft, setDraft] = useState<Formula | null>(null);
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [dragTargetTermId, setDragTargetTermId] = useState<string | null>(null);
  const [movedTermId, setMovedTermId] = useState<string | null>(null);
  const [savedFormulas, setSavedFormulas] = useState<Formula[]>(() =>
    readSavedFormulas(bankCode)
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [swappingTermIds, setSwappingTermIds] = useState<string[]>([]);
  const swapAnimationTimeout = useRef<number | null>(null);
  const moveAnimationTimeout = useRef<number | null>(null);
  const draggedTermRef = useRef<{
    id: string;
    side: FormulaSide;
  } | null>(null);

  useEffect(
    () => () => {
      if (swapAnimationTimeout.current !== null) {
        window.clearTimeout(swapAnimationTimeout.current);
      }
      if (moveAnimationTimeout.current !== null) {
        window.clearTimeout(moveAnimationTimeout.current);
      }
    },
    []
  );

  const visibleSections = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return gstParameterSections;

    return gstParameterSections
      .map((section) => ({
        ...section,
        groups: section.groups
          .map((group) => ({
            ...group,
            parameters: group.parameters.filter((parameter) =>
              `${section.title} ${group.title} ${parameter}`
                .toLowerCase()
                .includes(normalizedSearch)
            ),
          }))
          .filter((group) => group.parameters.length > 0),
      }))
      .filter((section) => section.groups.length > 0);
  }, [search]);

  const pickerParameters = useMemo(() => {
    const normalizedSearch = parameterSearch.trim().toLowerCase();
    return allGstParameters
      .filter((parameter) =>
        parameter.label.toLowerCase().includes(normalizedSearch)
      )
      .slice(0, 12);
  }, [parameterSearch]);

  const updateSide = (
    side: FormulaSide,
    update: (terms: FormulaTerm[]) => FormulaTerm[]
  ) => {
    setDraft((current) =>
      current ? { ...current, [side]: update(current[side]) } : current
    );
  };

  const addParameter = (parameter: GstParameter, side = activeSide) => {
    setActiveSide(side);
    setDraft((current) => {
      if (!current) return makeDraft(parameter, side);

      const terms = current[side];
      return {
        ...current,
        [side]: [...terms, newTerm(parameter)],
      };
    });
    setIsFormulaOpen(true);
    setStatusMessage('');
  };

  const handleParameterDrop = (
    event: DragEvent<HTMLElement>,
    side: FormulaSide
  ) => {
    event.preventDefault();
    const parameterId = event.dataTransfer.getData('text/gst-parameter-id');
    const parameter = allGstParameters.find((item) => item.id === parameterId);
    if (parameter) addParameter(parameter, side);
  };

  const handleTermDrop = (
    event: DragEvent<HTMLDivElement>,
    targetSide: FormulaSide,
    targetTermId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDragTargetTermId(null);

    const draggedTermId =
      draggedTermRef.current?.id ??
      event.dataTransfer.getData('text/gst-formula-term-id');
    const draggedSide =
      draggedTermRef.current?.side ??
      event.dataTransfer.getData('text/gst-formula-term-side');
    if (
      !draggedTermId ||
      (draggedSide !== 'left' && draggedSide !== 'right')
    ) {
      handleParameterDrop(event, targetSide);
      return;
    }
    const targetBounds = event.currentTarget.getBoundingClientRect();
    const insertAfter =
      event.clientY > targetBounds.top + targetBounds.height / 2;

    setDraft((current) => {
      if (!current) return current;
      const sourceTerms = [...current[draggedSide]];
      const targetTerms =
        draggedSide === targetSide ? sourceTerms : [...current[targetSide]];
      const sourceIndex = sourceTerms.findIndex(
        (term) => term.id === draggedTermId
      );
      const targetIndex = targetTerms.findIndex(
        (term) => term.id === targetTermId
      );
      if (sourceIndex < 0 || targetIndex < 0) return current;
      if (draggedSide === targetSide && draggedTermId === targetTermId) {
        return current;
      }

      const [draggedTerm] = sourceTerms.splice(sourceIndex, 1);
      let insertIndex = targetIndex + (insertAfter ? 1 : 0);
      if (draggedSide === targetSide && sourceIndex < insertIndex) {
        insertIndex -= 1;
      }
      insertIndex = Math.max(0, Math.min(insertIndex, targetTerms.length));
      targetTerms.splice(insertIndex, 0, draggedTerm);
      setMovedTermId(draggedTermId);
      if (moveAnimationTimeout.current !== null) {
        window.clearTimeout(moveAnimationTimeout.current);
      }
      moveAnimationTimeout.current = window.setTimeout(() => {
        setMovedTermId(null);
        moveAnimationTimeout.current = null;
      }, 380);

      return draggedSide === targetSide
        ? { ...current, [targetSide]: targetTerms }
        : {
            ...current,
            [draggedSide]: sourceTerms,
            [targetSide]: targetTerms,
          };
    });
  };

  const handleOperatorDrop = (
    event: DragEvent<HTMLElement>,
    side: FormulaSide,
    termId: string
  ) => {
    event.preventDefault();
    const operator = event.dataTransfer.getData('text/gst-arithmetic-operator');
    if (
      operator === '+' ||
      operator === '-' ||
      operator === '*' ||
      operator === '/' ||
      operator === '%'
    ) {
      updateTerm(side, termId, (current) => ({ ...current, operator }));
    }
  };

  const handleDockDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const parameterId = event.dataTransfer.getData('text/gst-parameter-id');
    const parameter = allGstParameters.find((item) => item.id === parameterId);
    if (parameter) addParameter(parameter, draft ? activeSide : 'left');
    else if (draft) setIsFormulaOpen(true);
  };

  const updateTerm = (
    side: FormulaSide,
    termId: string,
    update: (term: FormulaTerm) => FormulaTerm
  ) => {
    updateSide(side, (terms) =>
      terms.map((term) => (term.id === termId ? update(term) : term))
    );
  };

  const swapAdjacentTerms = (
    side: FormulaSide,
    previousTermId: string,
    nextTermId: string
  ) => {
    updateSide(side, (terms) => {
      const previousIndex = terms.findIndex(
        (term) => term.id === previousTermId
      );
      const nextIndex = terms.findIndex((term) => term.id === nextTermId);
      if (previousIndex < 0 || nextIndex !== previousIndex + 1) return terms;

      const previous = terms[previousIndex];
      const next = terms[nextIndex];
      setSwappingTermIds([previousTermId, nextTermId]);
      if (swapAnimationTimeout.current !== null) {
        window.clearTimeout(swapAnimationTimeout.current);
      }
      swapAnimationTimeout.current = window.setTimeout(() => {
        setSwappingTermIds([]);
        swapAnimationTimeout.current = null;
      }, 420);
      const swapped = [...terms];
      swapped[previousIndex] = {
        ...previous,
        kind: next.kind,
        label: next.label,
        parameterId: next.parameterId,
        value: next.value,
      };
      swapped[nextIndex] = {
        ...next,
        kind: previous.kind,
        label: previous.label,
        parameterId: previous.parameterId,
        value: previous.value,
      };
      return swapped;
    });
  };

  const saveFormula = () => {
    if (!draft?.left.length || !draft.right.length) {
      setStatusMessage('Add at least one item on each side of the comparison.');
      return;
    }

    const hasBlankValue = [...draft.left, ...draft.right].some(
      (term) => term.kind === 'value' && !term.value.trim()
    );
    if (hasBlankValue) {
      setStatusMessage('Enter a value for each numeric term before saving.');
      return;
    }

    const nextFormulas = [...savedFormulas, draft];
    try {
      sessionStorage.setItem(formulaKey(bankCode), JSON.stringify(nextFormulas));
      setSavedFormulas(nextFormulas);
      setDraft(null);
      setIsFormulaOpen(false);
      setStatusMessage('Formula saved in this browser session.');
    } catch (error) {
      console.error('Unable to save GST eligibility formula.', error);
      setStatusMessage('Could not save the formula in this browser session.');
    }
  };

  const deleteFormula = (formulaId: string) => {
    const nextFormulas = savedFormulas.filter(
      (formula) => formula.id !== formulaId
    );
    try {
      sessionStorage.setItem(formulaKey(bankCode), JSON.stringify(nextFormulas));
      setSavedFormulas(nextFormulas);
      setStatusMessage('Saved formula removed.');
    } catch (error) {
      console.error('Unable to remove saved GST eligibility formula.', error);
      setStatusMessage('Could not remove the saved formula.');
    }
  };

  const abortFormula = () => {
    setDraft(null);
    setIsFormulaOpen(false);
    setParameterPickerSide(null);
    setParameterSearch('');
    setStatusMessage('');
  };

  const formulaPreview =
    draft && (draft.left.length || draft.right.length)
      ? `${formatSide(draft.left) || 'Operand 1'} ${draft.comparator} ${formatSide(draft.right) || 'Operand 2'}`
      : 'Add parameters to start building your formula';

  const renderExpression = (side: FormulaSide) => {
    const terms = draft?.[side] ?? [];

    return (
      <section
        aria-label={side === 'left' ? 'Expression A' : 'Expression B'}
        className="gst-expression-side"
      >
        <div className="gst-expression-side-heading">
          <strong>{side === 'left' ? 'Parameters' : 'Final parameter'}</strong>
          <span>{terms.length} added</span>
        </div>
        {terms.length === 0 ? (
          <button
            className="gst-expression-empty"
            onClick={() => {
              setActiveSide(side);
              setParameterPickerSide(side);
              setParameterSearch('');
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleParameterDrop(event, side)}
            type="button"
          >
            Drop a parameter here or click to choose
          </button>
        ) : (
          <div className="gst-expression-terms">
            {terms.map((term, index) => (
              <div
                className={`gst-expression-term-wrap${swappingTermIds.includes(term.id) ? swappingTermIds[0] === term.id ? ' is-swapping-down' : ' is-swapping-up' : ''}`}
                key={term.id}
              >
                {index > 0 && (
                  <div className="gst-expression-controls">
                    <div
                      className="gst-expression-operator-slot"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) =>
                        handleOperatorDrop(event, side, term.id)
                      }
                      role="group"
                      aria-label={`Operator before ${term.label}: drag an operator here to change`}
                    >
                      <span aria-hidden="true">
                        <span
                          className="gst-operator-arrival"
                          key={term.operator}
                        >
                        {term.operator === '*'
                          ? '×'
                          : term.operator === '/'
                            ? '÷'
                            : term.operator === '-'
                              ? '−'
                              : term.operator}
                        </span>
                      </span>
                    </div>
                    <button
                      aria-label={`Swap ${terms[index - 1].label} and ${term.label}`}
                      className="gst-swap-terms"
                      onClick={() =>
                        swapAdjacentTerms(side, terms[index - 1].id, term.id)
                      }
                      title="Swap these adjacent parameters"
                      type="button"
                    >
                      <ArrowUpDown size={15} aria-hidden="true" />
                    </button>
                  </div>
                )}
                <div
                  className={`gst-expression-term${dragTargetTermId === term.id ? ' is-drop-target' : ''}${movedTermId === term.id ? ' is-reordered' : ''}`}
                  draggable={term.kind === 'parameter'}
                  onDragStart={(event) => {
                    draggedTermRef.current = { id: term.id, side };
                    event.dataTransfer.setData(
                      'text/gst-formula-term-id',
                      term.id
                    );
                    event.dataTransfer.setData(
                      'text/gst-formula-term-side',
                      side
                    );
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={() => {
                    draggedTermRef.current = null;
                    setDragTargetTermId(null);
                  }}
                  onDragEnter={() => setDragTargetTermId(term.id)}
                  onDragLeave={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setDragTargetTermId(null);
                    }
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleTermDrop(event, side, term.id)}
                >
                  {term.kind === 'value' ? (
                    <label className="gst-value-term">
                      <span>Value</span>
                      <input
                        aria-label={`${side} numeric value`}
                        min="0"
                        type="number"
                        value={term.value}
                        onChange={(event) =>
                          updateTerm(side, term.id, (current) => ({
                            ...current,
                            value: event.target.value,
                          }))
                        }
                      />
                    </label>
                  ) : (
                    <span className="gst-expression-chip" title={term.label}>
                      {term.label}
                    </span>
                  )}
                  <button
                    aria-label={`Remove ${term.label}`}
                    className="gst-remove-term"
                    onClick={() => {
                      updateSide(side, (current) =>
                        current.filter((item) => item.id !== term.id)
                      );
                    }}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          className="gst-add-parameter"
          aria-expanded={parameterPickerSide === side}
          onClick={() => {
            setActiveSide(side);
            setParameterPickerSide((current) => current === side ? null : side);
            setParameterSearch('');
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleParameterDrop(event, side)}
          type="button"
        >
          <Plus size={15} />
          Add parameter
        </button>
        {parameterPickerSide === side && (
          <div className="gst-parameter-picker">
            <label>
              <Search size={14} aria-hidden="true" />
              <input
                aria-label={`Search parameters for expression ${side === 'left' ? 'A' : 'B'}`}
                onChange={(event) => setParameterSearch(event.target.value)}
                placeholder="Search GST parameters"
                type="search"
                value={parameterSearch}
              />
            </label>
            <div className="gst-parameter-picker-options">
              {pickerParameters.length > 0 ? (
                pickerParameters.map((parameter) => (
                  <button
                    key={parameter.id}
                    onClick={() => {
                      addParameter(parameter, side);
                      setParameterPickerSide(null);
                      setParameterSearch('');
                    }}
                    type="button"
                  >
                    {parameter.label}
                  </button>
                ))
              ) : (
                <span>No matching parameters.</span>
              )}
            </div>
          </div>
        )}
        <button
          className="gst-add-value"
          onClick={() => {
            setActiveSide(side);
            updateSide(side, (terms) => [...terms, newValueTerm()]);
          }}
          type="button"
        >
          <Plus size={15} />
          Add value
        </button>
      </section>
    );
  };

  return (
    <div className="gst-eligibility-builder">
      <div className="gst-eligibility-workspace">
        <aside className="gst-module-sidebar">
          <p className="gst-module-sidebar-title">Modules</p>
          <div className="gst-module-tabs" role="tablist" aria-label="Eligibility modules">
            {['BSA', 'GST', 'ITR', 'CIBIL'].map((module) => (
              <button
                aria-selected={module === 'GST'}
                className={`gst-module-tab${module === 'GST' ? ' is-active' : ''}`}
                disabled={module !== 'GST'}
                key={module}
                role="tab"
                type="button"
              >
                <span className="gst-module-name">{module}</span>
                {module !== 'GST' && <span className="gst-module-status">Coming soon</span>}
              </button>
            ))}
          </div>
        </aside>

        <main className="gst-module-content">
          <div className="gst-builder-heading">
            <div>
              <p className="loan-eyebrow">Eligibility configuration · GST</p>
              <h1>Parameters list</h1>
              <p>
                Browse GST data points, then combine parameters and values into
                eligibility rules.
              </p>
            </div>
            <div className="gst-parameter-count">
              <strong>{allGstParameters.length}</strong>
              <span>parameters available</span>
            </div>
          </div>

          <nav className="gst-section-tabs" aria-label="GST parameter sections">
            {gstParameterSections.map((section) => (
              <button
                aria-current={activeSection === section.id ? 'location' : undefined}
                className={activeSection === section.id ? 'is-active' : ''}
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document
                    .getElementById(`gst-section-${section.id}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                type="button"
              >
                {section.title}
              </button>
            ))}
          </nav>

          <label className="gst-parameter-search">
            <Search size={17} aria-hidden="true" />
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search GST parameters"
              type="search"
              value={search}
            />
            <span>{search ? visibleSections.reduce(
              (count, section) =>
                count +
                section.groups.reduce(
                  (groupCount, group) => groupCount + group.parameters.length,
                  0
                ),
              0
            ) : allGstParameters.length}</span>
          </label>

          <div className="gst-parameter-sections">
            {visibleSections.map((section) => (
              <section
                aria-labelledby={`gst-section-title-${section.id}`}
                className="gst-parameter-section"
                id={`gst-section-${section.id}`}
                key={section.id}
              >
                <div className="gst-section-heading">
                  <span className="gst-section-marker" />
                  <div>
                    <p>GST parameter section</p>
                    <h2 id={`gst-section-title-${section.id}`}>{section.title}</h2>
                  </div>
                  <span className="gst-section-total">
                    {section.groups.reduce(
                      (count, group) => count + group.parameters.length,
                      0
                    )}{' '}
                    items
                  </span>
                </div>
                {section.groups.map((group) => (
                  <div className="gst-parameter-group" key={group.id}>
                    <h3>{group.title}</h3>
                    <div className="gst-parameter-grid">
                      {group.parameters.map((label) => {
                        const parameter = allGstParameters.find(
                          (item) =>
                            item.section === section.title &&
                            item.group === group.title &&
                            item.label === label
                        );
                        if (!parameter) return null;
                        return (
                          <button
                            className="gst-parameter-card"
                            draggable
                            key={parameter.id}
                            onClick={() => addParameter(parameter)}
                            onDragStart={(event) => {
                              event.dataTransfer.setData(
                                'text/gst-parameter-id',
                                parameter.id
                              );
                              event.dataTransfer.effectAllowed = 'copy';
                            }}
                            title="Click to add to the active expression, or drag into the formula builder"
                            type="button"
                          >
                            <GripVertical size={16} aria-hidden="true" />
                            <span>{parameter.label}</span>
                            <Plus size={16} aria-hidden="true" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </section>
            ))}
            {visibleSections.length === 0 && (
              <div className="gst-empty-search">
                <Search size={20} />
                <strong>No matching GST parameters</strong>
                <span>Try a different parameter name or section.</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {savedFormulas.length > 0 && (
        <section className="gst-saved-formulas" aria-labelledby="saved-formulas-title">
          <div className="gst-saved-heading">
            <div>
              <p className="loan-eyebrow">This browser session</p>
              <h2 id="saved-formulas-title">Saved eligibility rules</h2>
            </div>
            <span>{savedFormulas.length} saved</span>
          </div>
          {savedFormulas.map((formula, index) => (
            <article className="gst-saved-formula" key={formula.id}>
              <span className="gst-rule-number">Rule {index + 1}</span>
              <code>
                {formatSide(formula.left)} {formula.comparator}{' '}
                {formatSide(formula.right)}
              </code>
              <button
                aria-label={`Delete rule ${index + 1}`}
                onClick={() => deleteFormula(formula.id)}
                type="button"
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </section>
      )}

      {statusMessage && !draft && (
        <p className="gst-builder-status" role="status">{statusMessage}</p>
      )}

      {draft && isFormulaOpen && (
        <section className="gst-formula-preview" aria-live="polite">
          <span>Your formula is</span>
          <code key={formulaPreview}>{formulaPreview}</code>
        </section>
      )}

      <button
        className="gst-formula-dock"
        onClick={() => {
          if (!draft) {
            setDraft(makeDraft());
            setActiveSide('left');
            setActiveSide('left');
          }
          setIsFormulaOpen(true);
          setStatusMessage('');
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDockDrop}
        type="button"
      >
        <span className="gst-dock-icon">
          {/* It <ArrowDownToLine size={19} /> */}
        </span>
        <span>
          <strong>
            {draft
              ? `Continue editing formula · ${draft.left.length + draft.right.length} items`
              : 'Build an eligibility formula'}
          </strong>
          <small>
            {draft
              ? 'Your draft remains here until you abort or save it'
              : 'Drag a parameter here, or click to start a rule'}
          </small>
        </span>
        {draft ? <ChevronDown size={20} /> : <Plus size={20} />}
      </button>

      {draft && isFormulaOpen && (
        <div className="gst-formula-backdrop">
          <section
            aria-labelledby="gst-formula-title"
            aria-modal="true"
            className="gst-formula-modal"
            role="dialog"
          >
            <div className="gst-formula-modal-header">
              <div>
                <p className="loan-eyebrow">Rule builder</p>
                <h2 id="gst-formula-title">Create eligibility formula</h2>
              </div>
              <button
                aria-label="Abort formula editing"
                className="gst-modal-close"
                onClick={() => setIsFormulaOpen(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <p className="gst-formula-help">
              Drag an operator into a slot between parameters. Add parameters
              by dragging them into either expression or using the picker.
            </p>
            <div className="gst-operator-toolbar" aria-label="Arithmetic operators">
              <span>Operators</span>
              <div
                aria-label="Drag an operator into a formula slot"
                role="list"
              >
                {([
                  ['+', '+'],
                  ['-', '−'],
                  ['*', '×'],
                  ['/', '÷'],
                  ['%', '%'],
                ] as const).map(([operator, label]) => (
                  <span
                    aria-label={`Drag ${label} operator`}
                    className="gst-operator-drag-item"
                    draggable
                    key={operator}
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        'text/gst-arithmetic-operator',
                        operator
                      );
                      event.dataTransfer.effectAllowed = 'copy';
                    }}
                    role="listitem"
                    title={`Drag ${label} into an operator slot`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="gst-formula-composer">
              {renderExpression('left')}
              <label className="gst-comparator">
                <span>Combined operator</span>
                <select
                  aria-label="Combined operator"
                  value={draft.comparator}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? {
                            ...current,
                            comparator: event.target.value as Comparator,
                          }
                        : current
                    )
                  }
                >
                  <option value=">">&gt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="<">&lt;</option>
                  <option value="<=">&lt;=</option>
                  <option value="=">=</option>
                  <option value="!=">!=</option>
                </select>
              </label>
              {renderExpression('right')}
            </div>
            {statusMessage && (
              <p className="gst-builder-status" role="status">
                <CircleHelp size={16} />
                {statusMessage}
              </p>
            )}
            <div className="gst-formula-modal-footer">
              <p>
                Formula preview updates as you add parameters or change operators.
              </p>
              <div>
                <button
                  className="gst-abort-button"
                  onClick={abortFormula}
                  type="button"
                >
                  Abort
                </button>
                <button
                  className="gst-save-button"
                  onClick={saveFormula}
                  type="button"
                >
                  <Check size={16} />
                  Save formula
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
