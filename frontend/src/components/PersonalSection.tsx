import { User, MapPin, Mail, Phone, Github } from 'lucide-react';
import { PersonalInfo } from '../types';

interface PersonalSectionProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalSection({ data, onChange }: PersonalSectionProps) {
  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="section-title">Informations personnelles</h2>
            <p className="text-sm text-primary-500">Vos coordonnees et liens professionnels</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="form-group">
          <label className="label">Nom complet</label>
          <div className="relative">
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Jean Dupont"
              className="input pl-10"
            />
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Titre professionnel</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Developpeur Full Stack"
            className="input"
          />
        </div>

        <div className="form-group">
          <label className="label">Localisation</label>
          <div className="relative">
            <input
              type="text"
              value={data.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="Paris, France"
              className="input pl-10"
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <div className="relative">
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="jean@exemple.com"
              className="input pl-10"
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Telephone</label>
          <div className="relative">
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="input pl-10"
            />
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          </div>
        </div>

        <div className="form-group">
          <label className="label">GitHub</label>
          <div className="relative">
            <input
              type="text"
              value={data.github}
              onChange={(e) => updateField('github', e.target.value)}
              placeholder="username"
              className="input pl-10"
            />
            <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          </div>
        </div>

        <div className="form-group md:col-span-2">
          <label className="label">GitHub URL</label>
          <input
            type="url"
            value={data.github_url}
            onChange={(e) => updateField('github_url', e.target.value)}
            placeholder="https://github.com/username"
            className="input"
          />
        </div>
      </div>
    </div>
  );
}
