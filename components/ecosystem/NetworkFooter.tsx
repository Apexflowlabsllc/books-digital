import './network-footer.css';
import roster from './network-directory.json';

export default function NetworkFooter({ site }: { site: string }) {
  return (
    <section className="afl-network-footer" data-afl-site={site} data-afl-roster={roster.version} aria-label="Apex Flow Labs network">
      <div data-afl-part="inner">
        <div data-afl-part="intro">
          <h2>Explore the Apex Flow network</h2>
          <p>Find your next store, studio, or tool from Apex Flow Labs.</p>
        </div>
        <nav aria-label="Apex Flow businesses" data-afl-part="directory">
          {roster.groups.map(({ label, sites }) => (
            <div key={label} data-afl-part="group">
              <h3>{label}</h3>
              <ul>
                {sites.map((entry) => (
                  <li key={entry.id}>
                    <a href={entry.url} aria-current={site === entry.id ? true : undefined}
                      rel={entry.id === 'spiker' ? 'nofollow' : undefined}>{entry.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <nav aria-label="Network resources" data-afl-part="resources">
          <a href={roster.parent.url} aria-current={site === 'labs' ? true : undefined}>{roster.parent.name}</a>
          <a href={roster.parent.url + '/ecosystem'}>Business directory</a>
          <a href={roster.arcade.url}>{roster.arcade.name}</a>
        </nav>
      </div>
    </section>
  );
}
