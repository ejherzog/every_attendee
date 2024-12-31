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
    host_id integer REFERENCES people,
    title varchar(200) NOT NULL,
    start_time timestamptz,
    end_time timestamptz,
    location text,
    address text,
    description text,
    image_url text
);
```

```
CREATE TABLE hosts (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id char(6) REFERENCES events,
    host_id integer REFERENCES people
);
```

```
CREATE TABLE rsvps (
    id char(4) PRIMARY KEY,
    respondent_id integer REFERENCES people,
    guest_id integer REFERENCES people,
    event_id char(6) REFERENCES events,
    attending varchar(20) NOT NULL,
    comments text
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