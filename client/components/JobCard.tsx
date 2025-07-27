import React from 'react';
import Image from 'next/image';
import Logo from '../public/Logo.png';

interface JobCardProps {
  jobTitle: string;
  jobDepartment: string;
  jobDescription: string;
  totalApplicants: number;
}

const JobCard: React.FC<JobCardProps> = ({
  jobTitle,
  jobDepartment,
  jobDescription,
  totalApplicants,
}) => {
  return (
    <div className="w-full max-w-[800px] bg-white rounded-[20px] shadow-lg p-6 h-[250px] overflow-hidden py-10">
      <div className="flex items-start justify-between">
      <div className="flex items-start gap-4 w-full">
        <div className="w-12 h-12">
        <Image
          src={Logo}
          alt="Sense Sunset Logo"
          width={48}
          height={48}
          className="object-contain"
        />
        </div>
        <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 justify-between">
          <h2 className="text-[var(--color-contrast-color)] text-xl font-semibold">
          {jobTitle}
          </h2>
          <span className="text-[var(--color-primary-color)] scale-200 mr-10">→</span>
        </div>
        <div className="flex items-center">
          <p className="text-[var(--color-primary-color)] font-medium">
          {jobDepartment}
          </p>
        </div>
        </div>
      </div>
      </div>
      <div className="mt-4">
      <p className="text-[var(--color-contrast-color)] line-clamp-2">
        {jobDescription.split(' ').slice(0, 40).join(' ') + (jobDescription.split(' ').length > 40 ? '...' : '')}
      </p>
      </div>
      <div className="mt-4">
      <p className="text-[var(--color-contrast-color)] font-medium mt-5 border-t-[1px] py-5 border-contrast-color">
        <span className="text-[var(--color-primary-color)]">{totalApplicants}</span> + Applicants
      </p>
      </div>
    </div>
  );
};

export default JobCard;