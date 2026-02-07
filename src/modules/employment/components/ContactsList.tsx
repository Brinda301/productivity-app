'use client';
import { useState, useEffect } from 'react';
import type { Contact } from '@prisma/client';

interface ContactsListProps {
  applicationId?: string;
}

export default function ContactsList({ applicationId }: ContactsListProps) {
  const [contacts, setContacts] = useState<(Contact & { jobApplication?: { company: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const params = new URLSearchParams();
      if (applicationId) params.set('applicationId', applicationId);
      
      const res = await fetch(`/api/employment/contacts?${params}`);
      if (res.ok) {
        setContacts(await res.json());
      }
      setLoading(false);
    };
    fetchContacts();
  }, [applicationId]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>No contacts added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between"
        >
          <div>
            <p className="font-medium text-gray-900">{contact.name}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              {contact.role && <span>{contact.role}</span>}
              {contact.company && <span>@ {contact.company}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="p-2 text-gray-400 hover:text-blue-600 rounded"
                title={contact.email}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="p-2 text-gray-400 hover:text-green-600 rounded"
                title={contact.phone}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
