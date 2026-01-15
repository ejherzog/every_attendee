```
CREATE TABLE people (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    short_name varchar(50) NOT NULL,
    full_name varchar(200),
    email varchar(400),
    phone varchar(20)
);
```

```
CREATE TABLE events (
    id char(6) PRIMARY KEY,
    title varchar(200) NOT NULL,
    start_time varchar(30),
    end_time varchar(30),
    location text,
    address text,
    description text,
    image_url text
);
```

// Must keep hosts table because not all hosts are app_users. An event is owned by a single app_user (at first) but can be hosted by multiple people.

```
CREATE TABLE hosts (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id char(6) REFERENCES events,
    host_id integer REFERENCES people
);
```

```
CREATE TABLE responses (
    id char(4) PRIMARY KEY,
    respondent_id integer REFERENCES people,
    guest_id integer REFERENCES people,
    event_id char(6) REFERENCES events,
    attending varchar(20) NOT NULL,
    comments text
);
```

```
CREATE TABLE guests (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    response_id char(4) NOT NULL REFERENCES responses,
    guest_id integer NOT NULL REFERENCES people,
    attending varchar(20) NOT NULL CHECK (attending IN ('Yes', 'No', 'Maybe'))
);
```

```
CREATE TABLE pronouns (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subject varchar(20),
    object varchar(20),
    possessive varchar(20),
    determiner varchar(20),
    reflexive varchar(20),
    nickname varchar(100) NOT NULL,
    custom boolean
);
```

```
CREATE TABLE person_pronouns (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id integer REFERENCES people,
    pronoun_id integer REFERENCES pronouns
);
```

```
CREATE TABLE diets (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type varchar(30),
    details varchar(100),
    custom boolean
);
```

```
CREATE TABLE person_diets (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id integer REFERENCES people,
    diet_id integer REFERENCES diets
);
```

---

```
CREATE TABLE app_users (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    person_id integer REFERENCES people
);
```

```
CREATE TABLE user_sessions (
    id text NOT NULL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES app_users,
    expires_at TIMESTAMPTZ NOT NULL
);
```

```
CREATE TABLE app_users_events (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    app_user_id integer NOT NULL REFERENCES app_users,
    event_id char(6) REFERENCES events
);
```
