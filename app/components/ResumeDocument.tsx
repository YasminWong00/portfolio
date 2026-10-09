import {
  education,
  experience,
  mailto,
  profile,
  skillGroups,
} from "../data/profile";

export function ResumeDocument() {
  return (
    <article className="resume-doc">
      <header className="resume-head">
        <h1>{profile.name}</h1>
        <p className="resume-role">{profile.role}</p>
        <p className="resume-contact">
          <span>{profile.location}</span>
          <a href={mailto}>{profile.email}</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            {profile.linkedinLabel}
          </a>
        </p>
      </header>

      <section className="resume-block">
        <h2>Summary</h2>
        <p>{profile.summary}</p>
      </section>

      <section className="resume-block">
        <h2>Experience</h2>
        {experience.map((job) => (
          <div className="resume-item" key={`${job.company}-${job.dates}`}>
            <div className="resume-item-top">
              <h3>{job.role}</h3>
              <span>{job.dates}</span>
            </div>
            <p className="resume-where">
              {job.url ? (
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  {job.company}
                </a>
              ) : (
                job.company
              )}
              <span>, {job.location}</span>
            </p>
            <ul>
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="resume-block">
        <h2>Education</h2>
        <div className="resume-item">
          <div className="resume-item-top">
            <h3>{education.degree}</h3>
            <span>{education.dates}</span>
          </div>
          <p className="resume-where">
            {education.school}
            <span> · {education.note}</span>
          </p>
        </div>
      </section>

      <section className="resume-block">
        <h2>Skills</h2>
        <dl className="resume-skills">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <dt>{group.label}</dt>
              <dd>{group.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
