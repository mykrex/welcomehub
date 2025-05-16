'use client';

import React from 'react';
import './AdminPanel.css';
import Image from 'next/image';


interface Props {
    employee: { id: number; name: string; photo: string };
    isSelected: boolean;
    onSelect: () => void;
  }
  
  export default function EmployeeCard({ employee, isSelected, onSelect }: Props) {
    return (
      <button
        className={`employee-card ${isSelected ? 'selected' : ''}`}
        onClick={onSelect}
      >
        <Image
          src={employee.photo}
          alt={employee.name}
          width={40}
          height={40}
          className="avatar"
        />
        <span style={{ flexGrow: 1 }}>{employee.name}</span>
  
        <div className="arrow-circle">
          {isSelected ? '˅' : '˄'}
        </div>
      </button>
    );
  }
  
