import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Input, Row, Col, Label } from "reactstrap";

const Filter = ({ inputFields, filterValues, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const filterCard = document.getElementById('filter-card');
            const filterBtn = document.getElementById('filter-btn');
            if (isOpen && filterCard && !filterCard.contains(event.target) && !filterBtn.contains(event.target)) {
                setIsOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    const toggleFilter = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onFilterChange({ ...filterValues, [name]: value });
    };

    return (
        <div>
            <Button id="filter-btn" color="success users-btn" onClick={toggleFilter} className="filter-button">
                <i className="ri-filter-line me-1 align-bottom"></i> Filter
            </Button>
            {isOpen && (
                <Card id="filter-card" className="filter-card position-fixed top-48 end-0" style={{ width: '50%', maxWidth: '300px', zIndex: '1050' }}>
                    <CardBody>
                        {inputFields.map((field, index) => (
                            <Row key={index} className="mt-3">
                                <Col>
                                    <Label for={field.name}>{field.label}</Label>
                                    {(() => {
                                        switch (field.type) {
                                            case 'radio':
                                                return (
                                                    <div className="d-flex align-items-center">
                                                        {field.options.map((option, optionIndex) => (
                                                            <div key={optionIndex} className="form-check form-check-inline">
                                                                <Input
                                                                    type="radio"
                                                                    name={field.name}
                                                                    value={option.value}
                                                                    checked={filterValues[field.name] === option.value}
                                                                    onChange={handleInputChange}
                                                                    className="form-check-input"
                                                                />
                                                                <Label className="form-check-label">{option.label}</Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            default:
                                                return (
                                                    <Input
                                                        type={field.type}
                                                        id={field.name}
                                                        placeholder={field.placeholder}
                                                        name={field.name}
                                                        value={filterValues[field.name]}
                                                        onChange={handleInputChange}
                                                        style={{ marginBottom: '-6px', marginTop: "-6px" }}
                                                    />
                                                );
                                        }
                                    })()}
                                </Col>
                            </Row>
                        ))}
                    </CardBody>
                </Card>
            )}
        </div>
    );
};

export default Filter;
