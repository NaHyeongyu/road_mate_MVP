create or replace function public.is_email_registered(check_email text)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  normalized_email text;
begin
  normalized_email := lower(trim(check_email));

  if normalized_email is null or normalized_email = '' then
    return false;
  end if;

  return exists (
    select 1
    from auth.users
    where lower(coalesce(email, '')) = normalized_email
  );
end;
$$;

revoke all on function public.is_email_registered(text) from public;
grant execute on function public.is_email_registered(text) to anon, authenticated;
