# Emails and text messages (v1.6)

Templates for the messages Payana sends. Short, plain, same voice as the app.
`{curly}` = filled in by the system. `[square brackets]` = the team decides before launch.

Rules
- Login codes and safety messages are always sent and have no unsubscribe link. Everything else has one.
- Never put a login code, password or full phone number in an email subject.
- SMS: keep under 160 characters where possible; DLT template registration is needed in India before sending ([to confirm with the SMS provider]).
- Every message about a trip includes the safety line where it fits: meet in public first, share your plan, call 112 in an emergency.

## Emails

### 1. Welcome
- **From:** Payana `<hello@withpayana.com>` · **Subject:** Welcome to Payana, {first_name}
- **Heading:** Your next weekend starts here
- **Body:** Three quick things to get matched with the right people: 1) Finish your travel style 2) Verify with a selfie and DigiLocker 3) Request your first trip.
- **Button:** Open Payana
- **Footer:** Meet first in a public place and share your plans with someone you trust. · Unsubscribe

### 2. Request approved
- **From:** Payana `<trips@withpayana.com>` · **Subject:** You're in! {trip_name}, {dates}
- **Image:** trip cover
- **Heading:** {host_first_name} approved your request
- **Body:** You're now part of **{trip_name}**. Say hi to the group and check the plan. {dates} · about {budget} · {people} people
- **Button:** Open trip chat
- **Footer:** Don't send money until costs are agreed in the group chat. · Email settings

### 3. Trip reminder (day before)
- **From:** Payana `<trips@withpayana.com>` · **Subject:** Tomorrow: meet at {meet_time}
- **Heading:** {trip_name} is tomorrow
- **Box:** Meet: {meeting_point} · Time: {meet_time} · Host: {host_first_name} (in-app call)
- **Before you go:** Share the plan with someone you trust · Carry your ID, cash and a charged phone
- **Button:** Share with family
- **Footer:** In an emergency, call 112. · Email settings

### 4. Become the host (handover request)
- **Subject:** {old_host} asked you to host {trip_name}
- **Body:** "{reason message}". As host you approve requests, manage the plan and are the main contact. Please reply within 24 hours.
- **Buttons:** Accept and become host · Decline

### 5. Trip cancelled
- **Subject:** {trip_name} on {dates} was cancelled
- **Body:** {host_first_name} cancelled the trip. Reason: {reason}. Message: "{message}". Settle any money already shared directly with the group.
- **Button:** Find another trip

### 6. Review reminder (day after)
- **Subject:** How was {trip_name}?
- **Body:** Rate the trip and your travel mates. Reviews help everyone choose who to travel with.
- **Button:** Write review

## Text messages (SMS)

| Use | Text |
|---|---|
| Login code | `{code} is your Payana code. It expires in 10 min. Never share it, not even with Payana staff.` |
| Request approved | `Payana: You're in for {trip_name}, {dates}! Say hi to the group: {short_link}` |
| Trip morning | `Payana: {trip_name} today. Meet {meet_time}, {meeting_point}. Tap "I've reached" when you arrive.` |
| Emergency contact (main) | `{first_name} shared their Payana trip with you: {trip_name}, {dates}, {people} people. See plan & group: {short_link}` |
| Host handover | `Payana: {old_host} asked you to host {trip_name}. Reply in the app within 24 hours: {short_link}` |
| Trip cancelled | `Payana: {trip_name} on {dates} was cancelled by the host. Details: {short_link}` |
